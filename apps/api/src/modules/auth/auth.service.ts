import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
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

@Injectable()
export class AuthService {
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

  // ─────────────────────────────────────────────
  // OTP
  // ─────────────────────────────────────────────

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

    if (redis) {
      await redis.set(key, code, { ex: 300 });
    }

    if (!isEmail) {
      const sent = await this.smsService.sendOtp(identifier, code);
      if (!sent && this.isProd()) {
        throw new BadRequestException("Failed to send SMS OTP");
      }
    } else if (!this.isProd()) {
      console.log(`[DEV EMAIL OTP] ${identifier} => ${code}`);
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

    // Dev-only convenience code
    const allowDevCode = !this.isProd() && code === "123456";
    let valid = allowDevCode;

    if (!valid) {
      const key = `otp:${identifier}`;
      const stored = redis ? await redis.get<string>(key) : null;
      if (stored && stored === code) {
        valid = true;
        await redis.del(key);
      }
    }

    if (!valid) {
      throw new UnauthorizedException("Invalid or expired OTP");
    }

    // Single-use verification token (10 minutes)
    const verificationToken = randomBytes(32).toString("hex");
    const tokenKey = `verify:${verificationToken}`;
    if (redis) {
      await redis.set(tokenKey, identifier, { ex: 600 });
    }

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

    const tokenKey = `verify:${token}`;
    const bound = redis ? await redis.get<string>(tokenKey) : null;

    if (!bound || bound !== expectedIdentifier) {
      throw new UnauthorizedException("Invalid or expired verification token");
    }

    await redis.del(tokenKey);
  }

  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────

  async login(dto: LoginDto) {
    // Path A: email + password
    if (dto.email && dto.password) {
      const email = dto.email.trim().toLowerCase();
      const user = await this.usersService.findByEmail(email);

      if (!user || !user.passwordHash) {
        throw new UnauthorizedException("Invalid email or password");
      }

      const ok = await bcrypt.compare(dto.password, user.passwordHash);
      if (!ok) {
        throw new UnauthorizedException("Invalid email or password");
      }

      return this.authResponse(user);
    }

    // Path B: phone + password + OTP verificationToken
    if (dto.phoneNumber && dto.password && dto.verificationToken) {
      const phone = this.normalizePhone(dto.phoneNumber);
      await this.consumeVerificationToken(dto.verificationToken, phone);

      const user = await this.usersService.findByPhone(phone);
      if (!user || !user.passwordHash) {
        throw new UnauthorizedException("Invalid phone or password");
      }

      const ok = await bcrypt.compare(dto.password, user.passwordHash);
      if (!ok) {
        throw new UnauthorizedException("Invalid phone or password");
      }

      if (!user.phoneVerified) {
        await this.usersService.updateProfile(user.id, {
          phoneVerified: true,
        });
      }

      return this.authResponse(user);
    }

    throw new BadRequestException(
      "Provide email+password, or phoneNumber+password+verificationToken",
    );
  }

  // ─────────────────────────────────────────────
  // REGISTER
  // ─────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const phone = this.normalizePhone(dto.phoneNumber);
    const email = dto.email?.trim().toLowerCase();

    await this.consumeVerificationToken(dto.verificationToken, phone);

    const existingPhone = await this.usersService.findByPhone(phone);
    if (existingPhone) {
      throw new ConflictException(
        "An account with this phone number already exists",
      );
    }

    if (email) {
      const existingEmail = await this.usersService.findByEmail(email);
      if (existingEmail) {
        throw new ConflictException(
          "An account with this email already exists",
        );
      }
    }

    if (!dto.password || dto.password.length < 6) {
      throw new BadRequestException("Password must be at least 6 characters");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      phoneNumber: phone,
      fullName: dto.fullName,
      role: dto.role as any,
      email,
      passwordHash,
      phoneVerified: true,
      emailVerified: false,
    });

    return this.authResponse(user);
  }

  // ─────────────────────────────────────────────
  // GOOGLE
  // ─────────────────────────────────────────────

  async googleAuth(dto: GoogleAuthDto) {
    const googleUser = await this.verifyGoogleIdToken(dto.idToken);
    const email = googleUser.email?.toLowerCase();

    if (!email) {
      throw new UnauthorizedException("Google account has no email");
    }

    let user = await this.usersService.findByGoogleId(googleUser.sub);

    if (!user) {
      user = await this.usersService.findByEmail(email);

      if (user) {
        user = await this.usersService.updateProfile(user.id, {
          googleId: googleUser.sub,
          emailVerified: true,
          avatarUrl: googleUser.picture,
        });
      } else {
        if (!dto.role) {
          throw new BadRequestException(
            "role is required for first-time Google signup (PARENT or TEACHER)",
          );
        }

        // Unique placeholder phone until real phone is linked via OTP
        const placeholderPhone = `+google-${googleUser.sub.slice(0, 18)}`;

        user = await this.usersService.create({
          phoneNumber: placeholderPhone,
          email,
          fullName: googleUser.name || email.split("@")[0],
          role: dto.role as any,
          googleId: googleUser.sub,
          emailVerified: true,
          phoneVerified: false,
        });
      }
    }

    return this.authResponse(user);
  }

  private async verifyGoogleIdToken(idToken: string) {
    const res = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
    );

    if (!res.ok) {
      throw new UnauthorizedException("Invalid Google token");
    }

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
      email_verified?: string;
    };
  }

  // ─────────────────────────────────────────────
  // DEMO (development only)
  // ─────────────────────────────────────────────

  async demoLogin(role: "PARENT" | "TEACHER") {
    if (this.isProd()) {
      throw new ForbiddenException("Demo login is disabled in production");
    }

    const testEmail =
      role === "TEACHER"
        ? "teacher.demo@tutorbebetea.com"
        : "parent.demo@tutorbebetea.com";

    const testName =
      role === "TEACHER"
        ? "Yohannes Haile (Verified Tutor)"
        : "Abebe Bikila (Parent)";

    const testPhone =
      role === "TEACHER" ? "+251911223344" : "+251988776655";

    let user: any = await this.usersService.findByEmail(testEmail);

    if (!user) {
      user = await this.usersService.create({
        email: testEmail,
        fullName: testName,
        phoneNumber: testPhone,
        role: role as any,
        phoneVerified: true,
        emailVerified: true,
      });
    }

    return this.authResponse(user);
  }

  // ─────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────

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