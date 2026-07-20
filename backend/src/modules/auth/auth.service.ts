// src/modules/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../../services/email.service';
import { CacheService } from '../../services/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly cacheService: CacheService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullName, phone, userType } = registerDto;

    if ((userType as string) === 'ADMIN') {
      throw new BadRequestException('Admin accounts cannot be self-registered');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email or phone');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName,
        phone,
        userType,
        isVerified: true,
        isActive: true,
      },
    });

    if (userType === 'TEACHER') {
      await this.prisma.teacherProfile.create({
        data: {
          userId: user.id,
          hourlyRate: 0,
          verificationStatus: 'PENDING',
        },
      });
    }

    // Email delivery is optional until a real domain/provider is configured.
    // Never fail registration because outbound email is unavailable.
    try {
      await this.issueEmailVerification(user.id, user.email, user.fullName);
    } catch (err) {
      // already logged inside EmailService; account remains usable
    }

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { teacherProfile: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    if (user.userType === 'ADMIN' && !this.isAllowedAdminEmail(user.email)) {
      throw new UnauthorizedException('Admin access is restricted to the platform team');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const stored = await this.cacheService.get<string>(`refresh_token:${payload.sub}`);
      if (!stored || stored !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Rotate refresh token
      await this.cacheService.del(`refresh_token:${user.id}`);
      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyEmail(token: string) {
    const userId = await this.cacheService.get<string>(`email_verification:${token}`);
    if (!userId) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    await this.cacheService.del(`email_verification:${token}`);

    return { message: 'Email verified successfully' };
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Always return success to avoid email enumeration
    if (!user || user.isVerified) {
      return { message: 'If that account exists and is unverified, a new email was sent' };
    }

    try {
      await this.issueEmailVerification(user.id, user.email, user.fullName);
    } catch {
      // Email provider optional — do not fail the public resend endpoint.
    }
    return { message: 'If that account exists and is unverified, a new email was sent' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Always return success to avoid email enumeration
    if (!user || !user.isActive) {
      return { message: 'If that email is registered, a reset link was sent' };
    }

    const token = uuidv4();
    await this.cacheService.set(`password_reset:${token}`, user.id, 3600); // 1 hour
    try {
      await this.emailService.sendPasswordResetEmail({
        email: user.email,
        name: user.fullName,
        token,
      });
    } catch {
      // Don't leak provider failures to clients; token remains usable if email is retried later.
    }

    return { message: 'If that email is registered, a reset link was sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = await this.cacheService.get<string>(`password_reset:${token}`);
    if (!userId) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await this.cacheService.del(`password_reset:${token}`);
    // Invalidate existing refresh sessions
    await this.cacheService.del(`refresh_token:${userId}`);

    return { message: 'Password updated successfully' };
  }

  async logout(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }
    await this.cacheService.del(`refresh_token:${userId}`);
    return { message: 'Logged out successfully' };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) return null;
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    return isPasswordValid ? this.sanitizeUser(user) : null;
  }

  private async issueEmailVerification(userId: string, email: string, name: string) {
    const verificationToken = uuidv4();
    await this.cacheService.set(`email_verification:${verificationToken}`, userId, 86400);
    await this.emailService.sendVerificationEmail({
      email,
      name,
      token: verificationToken,
    });
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      userType: user.userType,
      isVerified: user.isVerified,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
    });

    await this.cacheService.set(
      `refresh_token:${user.id}`,
      refreshToken,
      7 * 24 * 60 * 60,
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
    };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  private isAllowedAdminEmail(email: string) {
    const raw =
      this.configService.get<string>('ADMIN_TEAM_EMAILS') ||
      this.configService.get<string>('ADMIN_EMAIL') ||
      '';
    const allowlist = raw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!allowlist.length) return true;
    return allowlist.includes(email.toLowerCase());
  }
}
