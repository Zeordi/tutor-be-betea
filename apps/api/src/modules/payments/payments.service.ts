import { Injectable, BadRequestException, NotFoundException, Logger } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { stripe } from "../../lib/stripe";
import {
  paymentConfig,
  isProviderConfigured,
  requestTelebirrCheckout,
  requestCbeBirrCheckout,
  requestMpesaCheckout,
} from "../../config/payment.config";

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger("Payments");

  async getParentWallet(userId: string) {
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const held = await prisma.tutoringContract.aggregate({
      where: {
        parentId: userId,
        status: { in: ["PENDING_ESCROW", "ACTIVE", "DISPUTED"] },
      },
      _sum: { escrowHeldAmount: true },
    });
    return {
      escrowHeld: held._sum.escrowHeldAmount || 0,
      transactions: payments,
    };
  }

  async getTeacherEarnings(teacherId: string) {
    const payouts = await prisma.payout.findMany({
      where: { teacherId },
      orderBy: { createdAt: "desc" },
    });
    const completed = await prisma.tutoringContract.aggregate({
      where: { teacherId, status: "COMPLETED" },
      _sum: { agreedAmount: true },
    });
    const pendingPayout = await prisma.payout.aggregate({
      where: { teacherId, status: { in: ["PENDING", "PROCESSING"] } },
      _sum: { amount: true },
    });
    return {
      totalEarned: completed._sum.agreedAmount || 0,
      pendingPayout: pendingPayout._sum.amount || 0,
      payouts,
    };
  }

  async initiatePayment(input: {
    userId: string;
    contractId?: string;
    amount: number;
    provider?: string;
  }) {
    if (!input.amount || Number(input.amount) <= 0) {
      throw new BadRequestException("Invalid amount");
    }

    const provider = (input.provider || "TELEBIRR").toUpperCase();

    if (!isProviderConfigured(provider)) {
      throw new BadRequestException(
        `Payment provider ${provider} is not configured. Contact support.`,
      );
    }

    if (input.contractId) {
      const contract = await prisma.tutoringContract.findUnique({
        where: { id: input.contractId },
      });
      if (!contract) {
        throw new NotFoundException("Contract not found");
      }
    }

    const externalRef = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    let redirectUrl: string | undefined;
    let meta: Record<string, any> = {};

    if (provider === "STRIPE") {
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(Number(input.amount) * 100),
        currency: "etb",
        metadata: {
          userId: input.userId,
          contractId: input.contractId || "",
          externalRef,
        },
      });
      const payment = await prisma.payment.create({
        data: {
          userId: input.userId,
          contractId: input.contractId,
          amount: input.amount,
          provider: "STRIPE",
          status: "PENDING",
          externalRef: intent.id,
          meta: { client_secret: intent.client_secret, externalRef },
        },
      });
      this.logger.log("Payment initiated", {
        paymentId: payment.id,
        provider,
        amount: input.amount,
        userId: input.userId,
        contractId: input.contractId,
      });
      return {
        payment,
        clientSecret: intent.client_secret,
        redirectUrl: undefined,
        externalRef: intent.id,
      };
    }

    if (provider === "TELEBIRR") {
      const checkout = await requestTelebirrCheckout({
        amount: Number(input.amount),
        currency: "ETB",
        merchantId: paymentConfig.telebirr.merchantId,
        notifyUrl: paymentConfig.telebirr.notifyUrl,
        externalRef,
      });
      redirectUrl = checkout.checkoutUrl;
      meta = { externalRef, transactionId: checkout.transactionId, expiresAt: checkout.expiresAt };
    } else if (provider === "CBE_BIRR") {
      const checkout = await requestCbeBirrCheckout({
        amount: Number(input.amount),
        currency: "ETB",
        merchantId: paymentConfig.cbeBirr.merchantId,
        notifyUrl: paymentConfig.cbeBirr.notifyUrl,
        externalRef,
      });
      redirectUrl = checkout.checkoutUrl;
      meta = { externalRef, transactionId: checkout.transactionId, expiresAt: checkout.expiresAt };
    } else if (provider === "MPESA") {
      const checkout = await requestMpesaCheckout({
        amount: Number(input.amount),
        currency: "ETB",
        merchantId: paymentConfig.mpesa.merchantId,
        notifyUrl: paymentConfig.mpesa.notifyUrl,
        externalRef,
      });
      redirectUrl = checkout.checkoutUrl;
      meta = { externalRef, transactionId: checkout.transactionId, expiresAt: checkout.expiresAt };
    }

    const payment = await prisma.payment.create({
      data: {
        userId: input.userId,
        contractId: input.contractId,
        amount: input.amount,
        provider: provider as any,
        status: "PENDING",
        externalRef,
        meta,
      },
    });

    if (input.contractId) {
      await prisma.tutoringContract.update({
        where: { id: input.contractId },
        data: {
          escrowHeldAmount: input.amount,
          status: "PENDING_ESCROW",
        },
      });
    }

    this.logger.log("Payment initiated", {
      paymentId: payment.id,
      provider,
      amount: input.amount,
      userId: input.userId,
      contractId: input.contractId,
    });

    return {
      payment,
      message: "Payment initiated — complete in " + provider,
      redirectUrl,
      externalRef,
    };
  }

  async getPaymentStatus(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { contract: true },
    });
    if (!payment) throw new NotFoundException("Payment not found");
    return {
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      provider: payment.provider,
      externalRef: payment.externalRef,
      contractId: payment.contractId,
      contractStatus: payment.contract?.status,
      createdAt: payment.createdAt,
    };
  }

  async reconcilePayment(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { contract: true },
    });
    if (!payment) throw new NotFoundException("Payment not found");

    if (payment.status !== "PENDING") {
      return { id: payment.id, status: payment.status, reconciled: false, reason: "not_pending" };
    }

    if (!payment.externalRef) {
      return { id: payment.id, status: payment.status, reconciled: false, reason: "missing_external_ref" };
    }

    const provider = payment.provider;
    if (!isProviderConfigured(provider)) {
      return { id: payment.id, status: payment.status, reconciled: false, reason: "provider_not_configured" };
    }

    let providerStatus: "SUCCESS" | "FAILED" | "PENDING" = "PENDING";

    if (provider === "TELEBIRR") {
      const checkout = await requestTelebirrCheckout({
        amount: Number(payment.amount),
        currency: payment.currency,
        merchantId: paymentConfig.telebirr.merchantId,
        notifyUrl: paymentConfig.telebirr.notifyUrl,
        externalRef: payment.externalRef,
      });
      providerStatus = checkout.checkoutUrl ? "PENDING" : "FAILED";
    } else if (provider === "CBE_BIRR") {
      const checkout = await requestCbeBirrCheckout({
        amount: Number(payment.amount),
        currency: payment.currency,
        merchantId: paymentConfig.cbeBirr.merchantId,
        notifyUrl: paymentConfig.cbeBirr.notifyUrl,
        externalRef: payment.externalRef,
      });
      providerStatus = checkout.checkoutUrl ? "PENDING" : "FAILED";
    } else if (provider === "MPESA") {
      const checkout = await requestMpesaCheckout({
        amount: Number(payment.amount),
        currency: "ETB",
        merchantId: paymentConfig.mpesa.merchantId,
        notifyUrl: paymentConfig.mpesa.notifyUrl,
        externalRef: payment.externalRef,
      });
      providerStatus = checkout.checkoutUrl ? "PENDING" : "FAILED";
    } else if (provider === "STRIPE") {
      providerStatus = "PENDING";
    }

    if (providerStatus === "FAILED" && payment.status === "PENDING") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });
      this.logger.warn("Payment reconciliation failed", {
        paymentId: payment.id,
        provider,
        externalRef: payment.externalRef,
      });
      return { id: payment.id, status: "FAILED", reconciled: true };
    }

    this.logger.log("Payment reconciled", {
      paymentId: payment.id,
      provider,
      externalRef: payment.externalRef,
      status: payment.status,
    });

    return { id: payment.id, status: payment.status, reconciled: true };
  }

  async handleWebhook(provider: string, body: any) {
    const ref =
      body?.transactionId || body?.id || body?.trx_id || body?.externalRef;
    if (!ref) return { ok: false, reason: "missing_ref" };

    const existing = await prisma.payment.findFirst({
      where: { externalRef: String(ref) },
    });

    if (!existing) {
      return { ok: false, reason: "payment_not_found" };
    }

    if (existing.status === "SUCCESS") {
      this.logger.log("Webhook already processed", {
        paymentId: existing.id,
        provider,
        externalRef: ref,
      });
      return { ok: true, alreadyProcessed: true, paymentId: existing.id };
    }

    const newStatus = body?.status === "FAILED" ? "FAILED" : "SUCCESS";

    const updated = await prisma.payment.update({
      where: { id: existing.id },
      data: {
        status: newStatus,
        meta: {
          ...(existing.meta as any || {}),
          webhookPayload: body,
          webhookProcessedAt: new Date().toISOString(),
        },
      },
    });

    if (newStatus === "SUCCESS" && existing.contractId) {
      await prisma.tutoringContract.update({
        where: { id: existing.contractId },
        data: { status: "ACTIVE" },
      });
    }

    this.logger.log("Payment webhook processed", {
      paymentId: updated.id,
      provider,
      externalRef: ref,
      status: updated.status,
    });

    return { ok: true, paymentId: updated.id, status: updated.status };
  }

  async requestPayout(
    teacherId: string,
    amount: number,
    provider?: string,
  ) {
    if (!amount || amount <= 0) {
      throw new BadRequestException("Invalid amount");
    }

    const earnings = await prisma.tutoringContract.aggregate({
      where: { teacherId, status: "COMPLETED" },
      _sum: { agreedAmount: true },
    });
    const pending = await prisma.payout.aggregate({
      where: { teacherId, status: { in: ["PENDING", "PROCESSING"] } },
      _sum: { amount: true },
    });

    const totalEarned = Number(earnings._sum.agreedAmount || 0);
    const pendingAmount = Number(pending._sum.amount || 0);
    const available = totalEarned - pendingAmount;

    if (amount > available) {
      throw new BadRequestException(
        `Insufficient earnings. Available: ${available}, requested: ${amount}`,
      );
    }

    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: teacherId },
      select: { payoutMethod: true, payoutAccount: true },
    });

    const payoutProvider = (provider || teacherProfile?.payoutMethod || "TELEBIRR") as any;
    const externalRef = payoutProvider === "TELEBIRR"
      ? `telebirr_payout_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      : payoutProvider === "CBE_BIRR"
        ? `cbe_payout_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
        : payoutProvider === "MPESA"
          ? `mpesa_payout_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
          : `payout_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const payout = await prisma.payout.create({
      data: {
        teacherId,
        amount,
        provider: payoutProvider,
        status: "PENDING",
        externalRef,
      },
    });

    this.logger.log("Payout requested", {
      payoutId: payout.id,
      teacherId,
      amount,
      provider: payoutProvider,
    });

    return payout;
  }
}
