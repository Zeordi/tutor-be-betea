import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../src/modules/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { EmailService } from '../../src/services/email.service';
import { CacheService } from '../../src/services/cache.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
jest.mock('uuid', () => ({ v4: () => 'verification-token' }));

describe('AuthService', () => {
  let service: AuthService;
  const prisma = {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    teacherProfile: { create: jest.fn() },
  };
  const jwtService = { sign: jest.fn().mockReturnValue('token'), verify: jest.fn() };
  const configService = { get: jest.fn().mockReturnValue('secret') };
  const emailService = { sendVerificationEmail: jest.fn() };
  const cacheService = { set: jest.fn(), get: jest.fn(), del: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      prisma as unknown as PrismaService,
      jwtService as unknown as JwtService,
      configService as unknown as ConfigService,
      emailService as unknown as EmailService,
      cacheService as unknown as CacheService,
    );
  });

  it('registers a parent and returns tokens', async () => {
    prisma.user.findFirst.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    prisma.user.create.mockResolvedValue({
      id: 'u1',
      email: 'p@example.com',
      fullName: 'Parent',
      phone: '+251911111111',
      userType: 'PARENT',
      isVerified: false,
      passwordHash: 'hashed',
    });

    const result = await service.register({
      fullName: 'Parent',
      email: 'p@example.com',
      phone: '+251911111111',
      password: 'SecurePass1',
      userType: 'PARENT' as never,
    });

    expect(prisma.teacherProfile.create).not.toHaveBeenCalled();
    expect(emailService.sendVerificationEmail).toHaveBeenCalled();
    expect(result.accessToken).toBe('token');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects duplicate registration', async () => {
    prisma.user.findFirst.mockResolvedValue({ id: 'existing' });
    await expect(
      service.register({
        fullName: 'Parent',
        email: 'p@example.com',
        phone: '+251911111111',
        password: 'SecurePass1',
        userType: 'PARENT' as never,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('logs in with valid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'p@example.com',
      passwordHash: 'hashed',
      isActive: true,
      userType: 'PARENT',
      isVerified: true,
      fullName: 'Parent',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    prisma.user.update.mockResolvedValue({});

    const result = await service.login({ email: 'p@example.com', password: 'SecurePass1' });
    expect(result.accessToken).toBe('token');
  });

  it('rejects inactive users on login', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'p@example.com',
      passwordHash: 'hashed',
      isActive: false,
    });
    await expect(
      service.login({ email: 'p@example.com', password: 'SecurePass1' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
