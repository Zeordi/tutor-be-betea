import { CanActivate, ExecutionContext, GoneException, INestApplication } from '@nestjs/common';
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
    process: jest.fn().mockRejectedValue(
      new GoneException(
        'POST /payments/process is removed. Use the clientSecret from teacher accept (or POST /payments) with Stripe.js; booking confirms via webhook.',
      ),
    ),
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

  it('POST /api/payments creates a payment intent for the authenticated parent', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/payments')
      .send({ bookingId: '11111111-1111-1111-1111-111111111111' })
      .expect(201);

    expect(res.body.clientSecret).toBe('secret');
    expect(paymentsService.create).toHaveBeenCalledWith(
      expect.objectContaining({ bookingId: '11111111-1111-1111-1111-111111111111' }),
      expect.objectContaining({ id: 'u1', userType: 'PARENT' }),
    );
  });

  it('POST /api/payments/process returns 410 Gone', async () => {
    await request(app.getHttpServer())
      .post('/api/payments/process')
      .send({
        bookingId: '11111111-1111-1111-1111-111111111111',
        paymentMethodId: 'pm_xxx',
      })
      .expect(410);

    expect(paymentsService.process).toHaveBeenCalledWith(
      expect.objectContaining({ bookingId: '11111111-1111-1111-1111-111111111111' }),
      expect.objectContaining({ id: 'u1', userType: 'PARENT' }),
    );
  });
});
