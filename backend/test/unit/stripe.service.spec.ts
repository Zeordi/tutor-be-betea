import { StripeService } from '../../src/services/stripe.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotificationService } from '../../src/services/notification.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

describe('StripeService webhook confirmations', () => {
  let service: StripeService;
  const prisma = {
    payment: {
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    booking: { update: jest.fn() },
    $transaction: jest.fn(),
  };
  const notificationService = {
    sendBookingConfirmedNotification: jest.fn(),
  };
  const configService = {
    get: jest.fn((key: string) => {
      if (key === 'STRIPE_SECRET_KEY') return 'sk_test_x';
      if (key === 'STRIPE_WEBHOOK_SECRET') return 'whsec_test';
      return undefined;
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new StripeService(
      configService as unknown as ConfigService,
      prisma as unknown as PrismaService,
      notificationService as unknown as NotificationService,
    );
  });

  it('marks payment SUCCEEDED and booking CONFIRMED on payment_intent.succeeded', async () => {
    prisma.payment.findUnique.mockResolvedValue({
      id: 'pay1',
      bookingId: 'b1',
      status: 'PENDING',
      booking: { status: 'PENDING', teacherId: 't1', parentId: 'p1' },
    });
    prisma.$transaction.mockImplementation(async (fn: (tx: typeof prisma) => unknown) => {
      prisma.booking.update.mockResolvedValue({
        id: 'b1',
        teacherId: 't1',
        parentId: 'p1',
        status: 'CONFIRMED',
      });
      return fn(prisma);
    });

    await (service as unknown as {
      handlePaymentSuccess: (pi: { id: string }) => Promise<void>;
    }).handlePaymentSuccess({ id: 'pi_1' });

    expect(prisma.payment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'pay1' },
        data: expect.objectContaining({ status: 'SUCCEEDED', transactionId: 'pi_1' }),
      }),
    );
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'b1' },
        data: { status: 'CONFIRMED' },
      }),
    );
    expect(notificationService.sendBookingConfirmedNotification).toHaveBeenCalledWith(
      expect.objectContaining({ bookingId: 'b1', teacherId: 't1', parentId: 'p1' }),
    );
  });

  it('is idempotent when payment already SUCCEEDED', async () => {
    prisma.payment.findUnique.mockResolvedValue({
      id: 'pay1',
      bookingId: 'b1',
      status: 'SUCCEEDED',
      booking: { status: 'CONFIRMED' },
    });

    await (service as unknown as {
      handlePaymentSuccess: (pi: { id: string }) => Promise<void>;
    }).handlePaymentSuccess({ id: 'pi_1' });

    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(notificationService.sendBookingConfirmedNotification).not.toHaveBeenCalled();
  });

  it('does not confirm cancelled bookings', async () => {
    prisma.payment.findUnique.mockResolvedValue({
      id: 'pay1',
      bookingId: 'b1',
      status: 'PENDING',
      booking: { status: 'CANCELLED', teacherId: 't1', parentId: 'p1' },
    });

    await (service as unknown as {
      handlePaymentSuccess: (pi: { id: string }) => Promise<void>;
    }).handlePaymentSuccess({ id: 'pi_1' });

    expect(prisma.payment.update).toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(notificationService.sendBookingConfirmedNotification).not.toHaveBeenCalled();
  });

  it('requires STRIPE_WEBHOOK_SECRET', async () => {
    configService.get.mockImplementation((key: string) => {
      if (key === 'STRIPE_SECRET_KEY') return 'sk_test_x';
      return undefined;
    });
    const local = new StripeService(
      configService as unknown as ConfigService,
      prisma as unknown as PrismaService,
      notificationService as unknown as NotificationService,
    );

    await expect(local.handleWebhook(Buffer.from('{}'), 'sig')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
