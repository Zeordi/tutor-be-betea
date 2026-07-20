// src/services/stripe.service.ts
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from './notification.service';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY') || 'sk_test_xxx', {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
    });
  }

  async createPaymentIntent(data: {
    amount: number;
    bookingId: string;
    parentId: string;
    description: string;
  }) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100),
      currency: 'usd',
      description: data.description,
      metadata: {
        bookingId: data.bookingId,
        parentId: data.parentId,
      },
      payment_method_types: ['card'],
    });

    return paymentIntent;
  }

  async releasePayment(data: {
    bookingId: string;
    amount: number;
    teacherId: string;
  }) {
    const teacher = await this.prisma.teacherProfile.findUnique({
      where: { id: data.teacherId },
      include: { user: true },
    });

    if (!teacher) {
      throw new BadRequestException('Teacher not found');
    }

    let stripeAccountId = teacher.stripeAccountId;

    if (!stripeAccountId) {
      const account = await this.stripe.accounts.create({
        type: 'express',
        email: teacher.user.email,
        metadata: {
          teacherId: teacher.id,
        },
        capabilities: {
          transfers: { requested: true },
        },
      });

      stripeAccountId = account.id;

      await this.prisma.teacherProfile.update({
        where: { id: teacher.id },
        data: { stripeAccountId },
      });
    }

    const transfer = await this.stripe.transfers.create({
      amount: Math.round(data.amount * 100),
      currency: 'usd',
      destination: stripeAccountId,
      metadata: {
        bookingId: data.bookingId,
        teacherId: data.teacherId,
      },
    });

    return transfer;
  }

  async refundPayment(paymentIntentId: string) {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
  }

  async createAccountLink(teacherId: string, returnUrl: string) {
    const teacher = await this.prisma.teacherProfile.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new BadRequestException('Teacher not found');
    }

    if (!teacher.stripeAccountId) {
      throw new BadRequestException('Teacher does not have a Stripe account');
    }

    return this.stripe.accountLinks.create({
      account: teacher.stripeAccountId,
      refresh_url: `${returnUrl}?refresh=true`,
      return_url: `${returnUrl}?success=true`,
      type: 'account_onboarding',
    });
  }

  async handleWebhook(body: Buffer, signature: string) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';
    if (!webhookSecret) {
      throw new BadRequestException('STRIPE_WEBHOOK_SECRET is not configured');
    }

    const event = this.stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case 'charge.refunded':
        await this.handleRefund(event.data.object as Stripe.Charge);
        break;
      default:
        this.logger.debug(`Unhandled Stripe event: ${event.type}`);
    }

    return { received: true };
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const payment = await this.prisma.payment.findUnique({
      where: { stripePaymentIntent: paymentIntent.id },
      include: { booking: true },
    });

    if (!payment) {
      this.logger.warn(`No payment row for intent ${paymentIntent.id}`);
      return;
    }

    if (payment.status === PaymentStatus.SUCCEEDED) {
      return;
    }

    if (
      payment.booking.status === BookingStatus.CANCELLED ||
      payment.booking.status === BookingStatus.COMPLETED
    ) {
      this.logger.warn(
        `Ignoring payment success for booking ${payment.bookingId} in status ${payment.booking.status}`,
      );
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.SUCCEEDED,
          transactionId: paymentIntent.id,
        },
      });
      return;
    }

    const booking = await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.SUCCEEDED,
          transactionId: paymentIntent.id,
        },
      });

      return tx.booking.update({
        where: { id: payment.bookingId },
        data: { status: BookingStatus.CONFIRMED },
      });
    });

    try {
      await this.notificationService.sendBookingConfirmedNotification({
        bookingId: booking.id,
        teacherId: booking.teacherId,
        parentId: booking.parentId,
      });
    } catch (err) {
      this.logger.warn(
        `Confirmed notification failed for booking ${booking.id}: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    await this.prisma.payment.updateMany({
      where: { stripePaymentIntent: paymentIntent.id },
      data: { status: PaymentStatus.FAILED },
    });
  }

  private async handleRefund(charge: Stripe.Charge) {
    const paymentIntentId = charge.payment_intent as string;
    if (!paymentIntentId) return;

    await this.prisma.payment.updateMany({
      where: { stripePaymentIntent: paymentIntentId },
      data: {
        status: PaymentStatus.REFUNDED,
        refundId: charge.id,
        refundAmount: charge.amount_refunded / 100,
      },
    });
  }
}
