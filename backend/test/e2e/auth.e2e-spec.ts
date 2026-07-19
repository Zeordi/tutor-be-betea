import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';
import { JwtAuthGuard } from '../../src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/modules/auth/guards/roles.guard';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const authService = {
    register: jest.fn().mockResolvedValue({
      user: { id: 'u1', email: 'p@example.com', userType: 'PARENT' },
      accessToken: 'access',
      refreshToken: 'refresh',
      expiresIn: 900,
    }),
    login: jest.fn().mockResolvedValue({
      user: { id: 'u1', email: 'p@example.com', userType: 'PARENT' },
      accessToken: 'access',
      refreshToken: 'refresh',
      expiresIn: 900,
    }),
    refreshToken: jest.fn().mockResolvedValue({ accessToken: 'access2', refreshToken: 'refresh2' }),
    verifyEmail: jest.fn().mockResolvedValue({ message: 'Email verified successfully' }),
    logout: jest.fn().mockResolvedValue({ message: 'Logged out successfully' }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: JwtAuthGuard, useValue: { canActivate: () => true } },
        { provide: RolesGuard, useValue: { canActivate: () => true } },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/register accepts lowercase userType', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        fullName: 'Parent One',
        email: 'parent@example.com',
        phone: '+251912345678',
        password: 'SecurePass1',
        userType: 'parent',
      })
      .expect(201);

    expect(authService.register).toHaveBeenCalledWith(
      expect.objectContaining({ userType: 'PARENT' }),
    );
  });

  it('POST /api/auth/login', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'parent@example.com', password: 'SecurePass1' })
      .expect(201);

    expect(res.body.accessToken).toBe('access');
  });
});
