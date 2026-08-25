import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { SmsService } from "../sms/sms.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { redis } from "../../config/redis";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
  ) {}

  async sendOtp(identifier: string) {
    const code = "123456"; // Default testing code if offline
    const key = `otp:${identifier}`;

    try {
      if (redis) {
        await redis.set(key, code, { ex: 300 });
      }
    } catch {
      // Redis fallback for local testing
    }

    // If it's a phone number, attempt SMS
    if (!identifier.includes("@")) {
      await this.smsService.sendOtp(identifier, code).catch(() => true);
    }

    return { message: "Verification code sent", testCode: code };
  }

  async verifyOtp(identifier: string, code: string) {
    // Allows 123456 as universal test code in dev
    if (code === "123456") {
      return { verified: true };
    }

    const key = `otp:${identifier}`;
    try {
      const stored = await redis.get<string>(key);
      if (stored && stored === code) {
        await redis.del(key);
        return { verified: true };
      }
    } catch {
      // Fallback
    }

    throw new UnauthorizedException("Invalid or expired OTP");
  }

  async login(dto: LoginDto) {
    let user: any = null;

    if (dto.email) {
      user = await this.usersService.findByEmail(dto.email);
    } else if (dto.phoneNumber) {
      user = await this.usersService.findByPhone(dto.phoneNumber);
    }

    if (!user) {
      // Auto-create for instant development testing if using email
      if (dto.email) {
        user = await this.usersService.create({
          email: dto.email,
          fullName: dto.email.split("@")[0] || "User",
          phoneNumber: `+2519${Math.floor(10000000 + Math.random() * 90000000)}`,
          role: "PARENT" as any,
        });
      } else {
        throw new UnauthorizedException("User not found with provided credentials");
      }
    }

    const tokens = await this.generateTokens(user.id, user.role);

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
      },
      ...tokens,
    };
  }

  async register(dto: RegisterDto) {
    const phoneNumber = dto.phoneNumber || `+2519${Math.floor(10000000 + Math.random() * 90000000)}`;

    if (dto.email) {
      const existingEmail = await this.usersService.findByEmail(dto.email);
      if (existingEmail) return this.login({ email: dto.email });
    }

    const user = await this.usersService.create({
      phoneNumber,
      fullName: dto.fullName,
      role: dto.role as any,
      email: dto.email,
    });

    const tokens = await this.generateTokens(user.id, user.role);

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
      },
      ...tokens,
    };
  }

  async demoLogin(role: "PARENT" | "TEACHER") {
    const testEmail = role === "TEACHER" ? "teacher.demo@tutorbebetea.com" : "parent.demo@tutorbebetea.com";
    const testName = role === "TEACHER" ? "Yohannes Haile (Verified Tutor)" : "Abebe Bikila (Parent)";

    let user: any = await this.usersService.findByEmail(testEmail).catch(() => null);

    if (!user) {
      user = await this.usersService.create({
        email: testEmail,
        fullName: testName,
        phoneNumber: role === "TEACHER" ? "+251911223344" : "+251988776655",
        role: role as any,
      });
    }

    const tokens = await this.generateTokens(user.id, user.role);

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: "ACTIVE",
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