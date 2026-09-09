import { Injectable, BadRequestException } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { stripe } from "../../lib/stripe";

@Injectable()
export class PaymentsService {
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
    const provider = (input.provider || "TELEBIRR") as any;

    if (provider === "STRIPE") {
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(Number(input.amount) * 100),
        currency: "etb",
        metadata: {
          userId: input.userId,
          contractId: input.contractId || "",
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
          meta: { client_secret: intent.client_secret },
        },
      });
      return { payment, clientSecret: intent.client_secret };
    }

    const payment = await prisma.payment.create({
      data: {
        userId: input.userId,
        contractId: input.contractId,
        amount: input.amount,
        provider,
        status: "PENDING",
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

    return {
      payment,
      message: "Payment initiated — complete in " + provider,
      redirectUrl: "/wallet",
    };
  }

  async handleWebhook(provider: string, body: any) {
    const ref =
      body?.transactionId || body?.id || body?.trx_id || body?.externalRef;
    if (!ref) return { ok: false, reason: "missing_ref" };

    const updated = await prisma.payment.updateMany({
      where: { externalRef: String(ref) },
      data: { status: "SUCCESS" },
    });

    const payment = await prisma.payment.findFirst({
      where: { externalRef: String(ref) },
    });
    if (payment?.contractId) {
      await prisma.tutoringContract.update({
        where: { id: payment.contractId },
        data: {
          status: "ACTIVE",
          // keep escrowHeldAmount until release
        },
      });
    }

    return { ok: true, updated: updated.count, provider };
  }

  async requestPayout(
    teacherId: string,
    amount: number,
    provider?: string,
  ) {
    if (!amount || amount <= 0) {
      throw new BadRequestException("Invalid amount");
    }
    return prisma.payout.create({
      data: {
        teacherId,
        amount,
        provider: (provider as any) || "TELEBIRR",
        status: "PENDING",
      },
    });
  }
}