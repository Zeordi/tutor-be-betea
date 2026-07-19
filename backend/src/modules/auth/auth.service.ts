// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
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

    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email or phone');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName,
        phone,
        userType,
        isVerified: false,
        isActive: true,
      },
    });

    // Create teacher profile if user is a teacher
    if (userType === 'TEACHER') {
      await this.prisma.teacherProfile.create({
        data: {
          userId: user.id,
          hourlyRate: 0,
          verificationStatus: 'PENDING',
        },
      });
    }

    // Send verification email
    const verificationToken = uuidv4();
    await this.cacheService.set(
      `email_verification:${verificationToken}`,
      user.id,
      86400, // 24 hours
    );

    await this.emailService.sendVerificationEmail({
      email: user.email,
      name: user.fullName,
      token: verificationToken,
    });

    // Generate tokens
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

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
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

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);
      return tokens;
    } catch (error) {
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

  async logout(userId: string) {
    await this.cacheService.del(`user_session:${userId}`);
    return { message: 'Logged out successfully' };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) return null;
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    return isPasswordValid ? this.sanitizeUser(user) : null;
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

    // Store refresh token in cache
    await this.cacheService.set(
      `refresh_token:${user.id}`,
      refreshToken,
      7 * 24 * 60 * 60, // 7 days
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
