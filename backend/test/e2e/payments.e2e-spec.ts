import { CanActivate, ExecutionContext, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PaymentsController } from '../../src/modules/payments/payments.controller';
import { PaymentsService } from '../../src/modules/payments/payments.service';
import { JwtAuthGuard } from '../../src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/modules/auth/guards/roles.guard';

class AllowParentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = { id: 'u1', userType: 'PARENT' };
    return true;
  }
}

describe('PaymentsController (e2e)', () => {
  let app: INestApplication;
  const paymentsService = {
    create: jest.fn().mockResolvedValue({
      id: 'pay1',
      bookingId: 'b1',
      clientSecret: 'secret',
      status: 'PENDING',
    }),
    process: jest.fn().mockResolvedValue({ success: true, paymentId: 'pay1' }),
    refund: jest.fn().mockResolvedValue({ paymentId: 'pay1', status: 'REFUNDED' }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [{ provide: PaymentsService, useValue: paymentsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(AllowParentGuard)
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/payments creates a payment intent', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/payments')
      .send({ bookingId: '11111111-1111-1111-1111-111111111111', amount: 40 })
      .expect(201);

    expect(res.body.clientSecret).toBe('secret');
    expect(paymentsService.create).toHaveBeenCalled();
  });
});
