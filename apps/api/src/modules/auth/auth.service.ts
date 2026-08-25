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

  async sendOtp(phoneNumber: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `otp:${phoneNumber}`;

    // 1. Store in Upstash Redis with 5-minute TTL (300 seconds)
    await redis.set(key, code, { ex: 300 });

    // 2. Deliver real SMS via AfroMessage
    const sent = await this.smsService.sendOtp(phoneNumber, code);

    if (!sent) {
      throw new InternalServerErrorException(
        "Failed to deliver verification code. Please check the phone number and try again."
      );
    }

    return { message: "OTP sent successfully" };
  }

  async verifyOtp(phoneNumber: string, code: string) {
    const key = `otp:${phoneNumber}`;
    const stored = await redis.get<string>(key);

    if (!stored) {
      throw new UnauthorizedException("OTP expired or not found");
    }

    if (stored !== code) {
      throw new UnauthorizedException("Invalid OTP");
    }

    // Delete OTP from Redis after successful verification
    await redis.del(key);

    return { verified: true };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByPhone(dto.phoneNumber);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const tokens = await this.generateTokens(user.id, user.role);

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
      },
      ...tokens,
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByPhone(dto.phoneNumber);
    if (existing) {
      throw new ConflictException("Phone number already registered");
    }

    const user = await this.usersService.create({
      phoneNumber: dto.phoneNumber,
      fullName: dto.fullName,
      role: dto.role,
      email: dto.email,
    });

    const tokens = await this.generateTokens(user.id, user.role);

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const tokens = await this.generateTokens(payload.sub, payload.role);
      return tokens;
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
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