import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  private otpStore = new Map<string, { code: string; expires: number }>();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async sendOtp(phoneNumber: string) {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store with 5 minutes expiry
    this.otpStore.set(phoneNumber, {
      code,
      expires: Date.now() + 5 * 60 * 1000,
    });

    // TODO: Integrate with real SMS provider (Twilio, Termii, Africa's Talking, or Telebirr SMS)
    console.log(`[OTP] ${phoneNumber} → ${code}`);

    return { message: "OTP sent successfully" };
  }

  async verifyOtp(phoneNumber: string, code: string) {
    const stored = this.otpStore.get(phoneNumber);

    if (!stored || stored.expires < Date.now()) {
      throw new UnauthorizedException("OTP expired or not found");
    }

    if (stored.code !== code) {
      throw new UnauthorizedException("Invalid OTP");
    }

    // OTP is valid – remove it
    this.otpStore.delete(phoneNumber);

    // Find or create user logic can go here
    return { verified: true };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByPhone(dto.phoneNumber);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // TODO: Add proper password / OTP verification (Supabase Auth or custom)
    // For now we issue token after basic existence check

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
