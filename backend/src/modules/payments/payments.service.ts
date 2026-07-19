import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeService } from '../../services/stripe.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { RefundDto } from './dto/refund.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  create(dto: CreatePaymentDto) {
    return {
      id: crypto.randomUUID(),
      bookingId: dto.bookingId,
      amount: dto.amount,
      currency: dto.currency || 'usd',
      status: 'requires_payment_method',
      clientSecret: `pi_test_${crypto.randomUUID()}_secret`,
    };
  }

  async process(dto: ProcessPaymentDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id: dto.bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');

    let payment = await this.prisma.payment.findFirst({
      where: { bookingId: dto.bookingId },
    });

    if (!payment) {
      const intent = await this.stripeService.createPaymentIntent({
        amount: Number(booking.totalAmount),
        bookingId: booking.id,
        parentId: booking.parentId,
        description: `Payment for booking ${booking.id}`,
      });

      payment = await this.prisma.payment.create({
        data: {
          bookingId: booking.id,
          stripePaymentIntent: intent.id,
          amount: booking.totalAmount,
          paymentMethod: dto.paymentMethodId,
          status: 'SUCCEEDED',
          transactionId: intent.id,
        },
      });
    } else {
      payment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          paymentMethod: dto.paymentMethodId,
          status: 'SUCCEEDED',
          transactionId: payment.stripePaymentIntent,
        },
      });
    }

    await this.prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CONFIRMED' },
    });

    return {
      success: true,
      paymentId: payment.id,
      status: 'SUCCEEDED',
      transactionId: payment.transactionId || payment.stripePaymentIntent,
    };
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
}
