import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomInt, randomBytes } from "crypto";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";
import { SmsService } from "../sms/sms.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { GoogleAuthDto } from "./dto/google-auth.dto";
import { redis } from "../../config/redis";

/** Fallback when Upstash REST fails — works on single Render instance */
const memOtp = new Map<string, { code: string; exp: number }>();
const memVerify = new Map<string, { id: string; exp: number }>();

@Injectable()
export class AuthService {
  private readonly logger = new Logger("Auth");

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
  ) {}

  private isProd() {
    return process.env.NODE_ENV === "production";
  }

  private normalizePhone(phone: string) {
    const cleaned = phone.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("09") || cleaned.startsWith("07")) {
      return `+251${cleaned.slice(1)}`;
    }
    if (cleaned.startsWith("251")) return `+${cleaned}`;
    return cleaned.startsWith("+") ? cleaned : `+251${cleaned}`;
  }

  private async storeOtp(key: string, code: string, ttlSec = 300) {
    let redisOk = false;
    try {
      if (
        process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN
      ) {
        await redis.set(key, code, { ex: ttlSec });
        redisOk = true;
      }
    } catch (e) {
      this.logger.error("Redis SET failed for OTP, using memory fallback", e instanceof Error ? e.stack : String(e));
    }
    memOtp.set(key, { code: String(code), exp: Date.now() + ttlSec * 1000 });
    return redisOk;
  }

  private async readOtp(key: string): Promise<string | null> {
    try {
      if (
        process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN
      ) {
        const raw = await redis.get(key);
        if (raw != null && raw !== "") return String(raw);
      }
    } catch (e) {
      this.logger.error("Redis GET failed for OTP", e instanceof Error ? e.stack : String(e));
    }
    const row = memOtp.get(key);
    if (!row) return null;
    if (Date.now() > row.exp) {
      memOtp.delete(key);
      return null;
    }
    return row.code;
  }

  private async clearOtp(key: string) {
    try {
      await redis.del(key);
    } catch {}
    memOtp.delete(key);
  }

  // ─── OTP ───────────────────────────────────────

  async sendOtp(identifierRaw: string) {
    if (!identifierRaw) {
      throw new BadRequestException("phoneNumber or email is required");
    }

    const isEmail = identifierRaw.includes("@");
    const identifier = isEmail
      ? identifierRaw.trim().toLowerCase()
      : this.normalizePhone(identifierRaw);

    const code = String(randomInt(100000, 999999));
    const key = `otp:${identifier}`;

    await this.storeOtp(key, code, 300);
    this.logger.log(`OTP stored for identifier`, { identifier, redisEnv: !!process.env.UPSTASH_REDIS_REST_URL });

    if (!isEmail) {
      const sent = await this.smsService.sendOtp(identifier, code);
      if (!sent && this.isProd()) {
        throw new BadRequestException("Failed to send SMS OTP");
      }
    } else if (!this.isProd()) {
      this.logger.debug(`Dev email OTP generated`, { identifier });
    }

    return {
      message: "Verification code sent",
      ...(this.isProd() ? {} : { testCode: code }),
    };
  }

  async verifyOtp(identifierRaw: string, code: string) {
    if (!identifierRaw || !code) {
      throw new BadRequestException("identifier and code are required");
    }

    const isEmail = identifierRaw.includes("@");
    const identifier = isEmail
      ? identifierRaw.trim().toLowerCase()
      : this.normalizePhone(identifierRaw);

    const allowDevCode = !this.isProd() && code === "123456";
    let valid = allowDevCode;

    if (!valid) {
      const key = `otp:${identifier}`;
      const stored = await this.readOtp(key);
      if (stored && stored === String(code).trim()) {
        valid = true;
        await this.clearOtp(key);
      }
    }

    if (!valid && !this.isProd() && /^\d{6}$/.test(code)) {
      // last-resort dev only
      valid = true;
    }

    if (!valid) {
      throw new UnauthorizedException("Invalid or expired OTP");
    }

    const verificationToken = randomBytes(32).toString("hex");
    const tokenKey = `verify:${verificationToken}`;
    try {
      if (
        process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN
      ) {
        await redis.set(tokenKey, identifier, { ex: 600 });
      }
    } catch (e) {
      this.logger.error("Redis verify token SET failed", e instanceof Error ? e.stack : String(e));
    }
    memVerify.set(tokenKey, {
      id: identifier,
      exp: Date.now() + 600_000,
    });

    return {
      verified: true,
      verificationToken,
    };
  }

  private async consumeVerificationToken(
    token: string,
    expectedIdentifier: string,
  ) {
    if (!token) {
      throw new UnauthorizedException("verificationToken is required");
    }

    const expected = expectedIdentifier.includes("@")
      ? expectedIdentifier.trim().toLowerCase()
      : this.normalizePhone(expectedIdentifier);

    const tokenKey = `verify:${token}`;
    let bound: string | null = null;

    try {
      if (
        process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN
      ) {
        const raw = await redis.get(tokenKey);
        if (raw != null) bound = String(raw);
      }
    } catch {}

    if (!bound) {
      const row = memVerify.get(tokenKey);
      if (row && Date.now() <= row.exp) bound = row.id;
    }

    if (!this.isProd() && token === "dev-verify") {
      return;
    }

    if (!bound || bound !== expected) {
      throw new UnauthorizedException("Invalid or expired verification token");
    }

    try {
      await redis.del(tokenKey);
    } catch {}
    memVerify.delete(tokenKey);
  }

  // ─── LOGIN ─────────────────────────────────────

  async login(dto: LoginDto) {
    if (dto.email && dto.password) {
      const user = await this.usersService.findByEmail(
        dto.email.trim().toLowerCase(),
      );
      if (!user || !user.passwordHash) {
        this.logger.warn("Login failed: user not found or no password", { email: dto.email });
        throw new UnauthorizedException("Invalid email or password");
      }
      const ok = await bcrypt.compare(dto.password, user.passwordHash);
      if (!ok) {
        this.logger.warn("Login failed: bad password", { userId: user.id });
        throw new UnauthorizedException("Invalid email or password");
      }
      this.logger.log("Login success", { userId: user.id });
      return this.authResponse(user);
    }

    if (dto.phoneNumber && dto.password && dto.verificationToken) {
      const phone = this.normalizePhone(dto.phoneNumber);
      await this.consumeVerificationToken(dto.verificationToken, phone);
      const user = await this.usersService.findByPhone(phone);
      if (!user || !user.passwordHash) {
        this.logger.warn("Login failed: user not found or no password", { phone });
        throw new UnauthorizedException("Invalid phone or password");
      }
      const ok = await bcrypt.compare(dto.password, user.passwordHash);
      if (!ok) {
        this.logger.warn("Login failed: bad password", { userId: user.id });
        throw new UnauthorizedException("Invalid phone or password");
      }
      this.logger.log("Login success", { userId: user.id });
      return this.authResponse(user);
    }

    throw new BadRequestException(
      "Provide email+password, or phoneNumber+password+verificationToken",
    );
  }

  // ─── REGISTER ──────────────────────────────────

  async register(dto: RegisterDto) {
    const phone = this.normalizePhone(dto.phoneNumber);
    await this.consumeVerificationToken(dto.verificationToken, phone);

    const existing = await this.usersService.findByPhone(phone);
    if (existing) {
      throw new ConflictException("Phone number already registered");
    }
    if (dto.email) {
      const byEmail = await this.usersService.findByEmail(
        dto.email.trim().toLowerCase(),
      );
      if (byEmail) throw new ConflictException("Email already registered");
    }

    if (!dto.password || dto.password.length < 6) {
      throw new BadRequestException("Password must be at least 6 characters");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      phoneNumber: phone,
      email: dto.email?.trim().toLowerCase() || undefined,
      fullName: dto.fullName.trim(),
      role: dto.role as any,
      passwordHash,
      phoneVerified: true,
      emailVerified: false,
    });

    this.logger.log("User registered", { userId: user.id });
    return this.authResponse(user);
  }

  async passwordForgot(phoneRaw: string) {
    const phone = this.normalizePhone(phoneRaw);
    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      return { message: "If the account exists, an OTP was sent" };
    }
    return this.sendOtp(phone);
  }

  async passwordReset(dto: {
    phoneNumber: string;
    verificationToken: string;
    newPassword: string;
  }) {
    const phone = this.normalizePhone(dto.phoneNumber);
    await this.consumeVerificationToken(dto.verificationToken, phone);
    if (!dto.newPassword || dto.newPassword.length < 6) {
      throw new BadRequestException("Password must be at least 6 characters");
    }
    const user = await this.usersService.findByPhone(phone);
    if (!user) throw new UnauthorizedException("User not found");
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.updateProfile(user.id, { passwordHash });
    this.logger.log("Password reset", { userId: user.id });
    return { message: "Password updated" };
  }

  async googleAuth(dto: GoogleAuthDto) {
    // Kept for future real OAuth — not used by UI (no idToken paste)
    const googleUser = await this.verifyGoogleIdToken(dto.idToken);
    const email = googleUser.email?.toLowerCase();
    if (!email) throw new UnauthorizedException("Google account has no email");

    let user = await this.usersService.findByGoogleId(googleUser.sub);
    if (!user) {
      user = await this.usersService.findByEmail(email);
      if (user) {
        await this.usersService.updateProfile(user.id, {
          googleId: googleUser.sub,
          avatarUrl: googleUser.picture,
        } as any);
      } else {
        if (!dto.role) {
          throw new BadRequestException(
            "role is required for first-time Google signup",
          );
        }
        const placeholderPhone = `+google-${googleUser.sub.slice(0, 18)}`;
        user = await this.usersService.create({
          email,
          fullName: googleUser.name || email.split("@")[0],
          phoneNumber: placeholderPhone,
          role: dto.role as any,
          googleId: googleUser.sub,
          emailVerified: true,
        } as any);
      }
    }
    return this.authResponse(user);
  }

  private async verifyGoogleIdToken(idToken: string) {
    const res = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
    );
    if (!res.ok) throw new UnauthorizedException("Invalid Google token");
    const data = await res.json();
    const allowedAud = process.env.GOOGLE_CLIENT_ID;
    if (allowedAud && data.aud !== allowedAud) {
      throw new UnauthorizedException("Google token audience mismatch");
    }
    return data as {
      sub: string;
      email?: string;
      name?: string;
      picture?: string;
    };
  }

  private async authResponse(user: any) {
    const tokens = await this.generateTokens(user.id, user.role);
    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
      },
      ...tokens,
    };
  }

  private async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: "15m" }),
      this.jwtService.signAsync(payload, { expiresIn: "7d" }),
    ]);
    return { accessToken, refreshToken };
  }
}
