import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto, RegisterRole } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const userType = dto.role === RegisterRole.TEACHER ? UserType.TEACHER : UserType.PARENT;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.name,
        phone: `+temp-${Date.now()}`,
        userType,
        passwordHash,
      },
    });

    return this.issueToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return this.issueToken(user);
  }

  async resetPassword(dto: ResetPasswordDto) {
    return { message: 'If the account exists, a reset email was sent', email: dto.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  private issueToken(user: {
    id: string;
    email: string;
    fullName: string;
    userType: string;
  }) {
    const payload = { sub: user.id, email: user.email, role: user.userType };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: user.userType,
      },
    };
  }
}
