// src/services/stripe.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
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

    // Create Stripe account if teacher doesn't have one
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

    // Create transfer to teacher
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
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    return refund;
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

    const accountLink = await this.stripe.accountLinks.create({
      account: teacher.stripeAccountId,
      refresh_url: `${returnUrl}?refresh=true`,
      return_url: `${returnUrl}?success=true`,
      type: 'account_onboarding',
    });

    return accountLink;
  }

  async handleWebhook(body: Buffer, signature: string) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';
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
    }

    return { received: true };
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    await this.prisma.payment.update({
      where: { stripePaymentIntent: paymentIntent.id },
      data: {
        status: 'SUCCEEDED',
        transactionId: paymentIntent.id,
      },
    });

    // Confirm booking
    const payment = await this.prisma.payment.findFirst({
      where: { stripePaymentIntent: paymentIntent.id },
    });

    if (payment) {
      await this.prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'CONFIRMED' },
      });
    }
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    await this.prisma.payment.update({
      where: { stripePaymentIntent: paymentIntent.id },
      data: { status: 'FAILED' },
    });
  }

  private async handleRefund(charge: Stripe.Charge) {
    const paymentIntentId = charge.payment_intent as string;
    if (paymentIntentId) {
      await this.prisma.payment.update({
        where: { stripePaymentIntent: paymentIntentId },
        data: {
          status: 'REFUNDED',
          refundId: charge.id,
          refundAmount: charge.amount_refunded / 100,
        },
      });
    }
  }
}
