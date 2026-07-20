import {
  BadRequestException,
  ForbiddenException,
  GoneException,
} from '@nestjs/common';
import { PaymentsService } from '../../src/modules/payments/payments.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { StripeService } from '../../src/services/stripe.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  const prisma = {
    booking: { findUnique: jest.fn() },
    payment: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
  };
  const stripeService = {
    createPaymentIntent: jest.fn(),
    refundPayment: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PaymentsService(
      prisma as unknown as PrismaService,
      stripeService as unknown as StripeService,
    );
  });

  it('rejects payment create when caller is not the booking parent', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'b1',
      parentId: 'p1',
      status: 'PENDING',
      totalAmount: 40,
    });

    await expect(
      service.create({ bookingId: 'b1' }, { id: 'other', userType: 'PARENT' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects payment create before teacher accept (no payment row)', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'b1',
      parentId: 'p1',
      status: 'PENDING',
      totalAmount: 40,
    });
    prisma.payment.findFirst.mockResolvedValue(null);

    await expect(
      service.create({ bookingId: 'b1' }, { id: 'p1', userType: 'PARENT' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('retries payment after teacher accept using booking amount', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'b1',
      parentId: 'p1',
      status: 'PENDING',
      totalAmount: 55,
    });
    prisma.payment.findFirst.mockResolvedValue({ id: 'pay1', status: 'FAILED' });
    stripeService.createPaymentIntent.mockResolvedValue({
      id: 'pi_retry',
      client_secret: 'secret_retry',
    });
    prisma.payment.update.mockResolvedValue({
      id: 'pay1',
      status: 'PENDING',
    });

    const result = await service.create({ bookingId: 'b1', amount: 999 }, {
      id: 'p1',
      userType: 'PARENT',
    });

    expect(stripeService.createPaymentIntent).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 55, bookingId: 'b1', parentId: 'p1' }),
    );
    expect(result.clientSecret).toBe('secret_retry');
    expect(result.amount).toBe(55);
  });

  it('allows ADMIN to retry payment for any parent', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'b1',
      parentId: 'p1',
      status: 'PENDING',
      totalAmount: 40,
    });
    prisma.payment.findFirst.mockResolvedValue({ id: 'pay1', status: 'PENDING' });
    stripeService.createPaymentIntent.mockResolvedValue({
      id: 'pi_admin',
      client_secret: 'secret_admin',
    });
    prisma.payment.update.mockResolvedValue({ id: 'pay1', status: 'PENDING' });

    const result = await service.create({ bookingId: 'b1' }, {
      id: 'admin1',
      userType: 'ADMIN',
    });

    expect(result.clientSecret).toBe('secret_admin');
  });

  it('process endpoint is gone', async () => {
    await expect(
      service.process({}, { id: 'p1', userType: 'PARENT' }),
    ).rejects.toBeInstanceOf(GoneException);
  });
});
