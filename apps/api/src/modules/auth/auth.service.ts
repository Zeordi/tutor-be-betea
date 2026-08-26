// apps/api/src/modules/auth/auth.service.ts
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

  async sendOtp(identifierRaw: string) {
    if (!identifierRaw) {
      throw new BadRequestException("phoneNumber or email is required");
    }

    const isEmail = identifierRaw.includes("@");
    const identifier = isEmail
      ? identifierRaw.trim().toLowerCase()
      : this.normalizePhone(identifierRaw);

    // Random 6-digit OTP always
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
    } else {
      // Email OTP: integrate Resend/SendGrid later.
      // For now log outside production only.
      if (!this.isProd()) {
        console.log(`[DEV EMAIL OTP] ${identifier} => ${code}`);
      }
    }

    return {
      message: "Verification code sent",
      // never expose OTP in production
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

    // Dev convenience only
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

    // Issue single-use verification token (10 min)
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

  async login(dto: LoginDto) {
    // Path A: email + password
    if (dto.email && dto.password) {
      const email = dto.email.trim().toLowerCase();
      const user = await this.usersService.findByEmail(email);
      if (!user || !user.passwordHash) {
        throw new UnauthorizedException("Invalid email or password");
      }
      const ok = await bcrypt.compare(dto.password, user.passwordHash);
      if (!ok) throw new UnauthorizedException("Invalid email or password");
      return this.authResponse(user);
    }

    // Path B: phone + OTP verificationToken
    if (dto.phoneNumber && dto.verificationToken) {
      const phone = this.normalizePhone(dto.phoneNumber);
      await this.consumeVerificationToken(dto.verificationToken, phone);

      const user = await this.usersService.findByPhone(phone);
      if (!user) throw new UnauthorizedException("User not found");

      // mark phone verified
      if (!user.phoneVerified) {
        await this.usersService.updateProfile(user.id, { phoneVerified: true });
      }

      return this.authResponse(user);
    }

    throw new BadRequestException(
      "Provide email+password or phoneNumber+verificationToken",
    );
  }

  async register(dto: RegisterDto) {
    const phone = this.normalizePhone(dto.phoneNumber);
    const email = dto.email?.trim().toLowerCase();

    await this.consumeVerificationToken(dto.verificationToken, phone);

    const existingPhone = await this.usersService.findByPhone(phone);
    if (existingPhone) {
      throw new ConflictException("An account with this phone number already exists");
    }

    if (email) {
      const existingEmail = await this.usersService.findByEmail(email);
      if (existingEmail) {
        throw new ConflictException("An account with this email already exists");
      }
    }

    const passwordHash = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : undefined;

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

  /**
   * Google Sign-In
   * Client sends Google ID token.
   * Backend verifies with Google tokeninfo endpoint.
   * If first time: creates account (role required).
   * If email already exists: links googleId and logs in.
   */
  async googleAuth(dto: GoogleAuthDto) {
    const googleUser = await this.verifyGoogleIdToken(dto.idToken);
    const email = googleUser.email?.toLowerCase();
    if (!email) {
      throw new UnauthorizedException("Google account has no email");
    }

    // Prefer googleId match
    let user = await this.usersService.findByGoogleId(googleUser.sub);

    if (!user) {
      user = await this.usersService.findByEmail(email);

      if (user) {
        // Link Google to existing email account
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

        // Placeholder unique phone until user links real phone via OTP
        // Format keeps uniqueness without colliding with real Ethiopian numbers
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
    // Simple verification endpoint. For higher security later, use google-auth-library.
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
    const testPhone = role === "TEACHER" ? "+251911223344" : "+251988776655";

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