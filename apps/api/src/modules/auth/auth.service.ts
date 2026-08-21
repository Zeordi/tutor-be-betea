import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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
