import {
  BadRequestException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeService } from '../../services/stripe.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundDto } from './dto/refund.dto';

type AuthCaller = {
  id: string;
  userType?: string;
};

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  /**
   * Parent resumes / retries payment for a teacher-accepted booking.
   * Amount always comes from the booking — never from the client.
   */
  async create(dto: CreatePaymentDto, caller: AuthCaller) {
    const booking = await this.prisma.booking.findUnique({ where: { id: dto.bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');

    this.assertCanPay(booking.parentId, caller);

    if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Booking cannot be paid in its current state');
    }

    if (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.IN_PROGRESS) {
      throw new BadRequestException('Booking is already paid / confirmed');
    }

    const amount = Number(booking.totalAmount);
    if (amount < 0.5) throw new BadRequestException('Amount must be at least 0.50');

    // PaymentIntent is created when the teacher accepts. This endpoint only retries.
    const existing = await this.prisma.payment.findFirst({
      where: { bookingId: booking.id },
      orderBy: { createdAt: 'desc' },
    });
    if (!existing) {
      throw new BadRequestException(
        'Teacher must accept the booking before payment. Use the clientSecret from PUT /bookings/:id/confirm.',
      );
    }
    if (existing.status === 'SUCCEEDED') {
      throw new BadRequestException('Booking already paid');
    }

    const intent = await this.stripeService.createPaymentIntent({
      amount,
      bookingId: booking.id,
      parentId: booking.parentId,
      description: `Payment for booking ${booking.id}`,
    });

    const payment = existing
      ? await this.prisma.payment.update({
          where: { id: existing.id },
          data: {
            stripePaymentIntent: intent.id,
            amount,
            status: 'PENDING',
            paymentMethod: 'CARD',
            metadata: { currency: 'usd' },
          },
        })
      : await this.prisma.payment.create({
          data: {
            bookingId: booking.id,
            stripePaymentIntent: intent.id,
            amount,
            status: 'PENDING',
            paymentMethod: 'CARD',
            metadata: { currency: 'usd' },
          },
        });

    return {
      id: payment.id,
      bookingId: booking.id,
      amount,
      currency: 'usd',
      status: payment.status,
      clientSecret: intent.client_secret,
      stripePaymentIntent: intent.id,
    };
  }

  /**
   * @deprecated Server-side "mark paid" is removed. Parents must confirm the
   * PaymentIntent client-side; Stripe webhook confirms the booking.
   */
  async process(_dto: unknown, _caller: AuthCaller) {
    throw new GoneException(
      'POST /payments/process is removed. Use the clientSecret from teacher accept (or POST /payments) with Stripe.js; booking confirms via webhook.',
    );
  }

  async refund(dto: RefundDto) {
    const payment = await this.prisma.payment.findUnique({ where: { id: dto.paymentId } });
    if (!payment) throw new BadRequestException('Payment not found');
    await this.stripeService.refundPayment(payment.stripePaymentIntent);
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'REFUNDED', refundAmount: dto.amount },
    });
    return { paymentId: dto.paymentId, status: 'REFUNDED', amount: dto.amount };
  }

  private assertCanPay(parentId: string, caller: AuthCaller) {
    if (caller.userType === 'ADMIN') return;
    if (caller.id !== parentId) {
      throw new ForbiddenException('You can only pay for your own bookings');
    }
  }
}
