import { Injectable } from "@nestjs/common";
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
        status: { in: ["PENDING_ESCROW", "ACTIVE"] },
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
    return {
      totalEarned: completed._sum.agreedAmount || 0,
      payouts,
    };
  }

  async initiatePayment(body: {
    userId: string;
    contractId?: string;
    amount: number;
    provider?: string;
  }) {
    const provider = (body.provider || "TELEBIRR") as any;

    if (provider === "STRIPE") {
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(Number(body.amount) * 100),
        currency: "etb",
        metadata: {
          userId: body.userId,
          contractId: body.contractId || "",
        },
      });
      const payment = await prisma.payment.create({
        data: {
          userId: body.userId,
          contractId: body.contractId,
          amount: body.amount,
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
        userId: body.userId,
        contractId: body.contractId,
        amount: body.amount,
        provider,
        status: "PENDING",
      },
    });

    return {
      payment,
      message: "Payment initiated — complete in " + provider,
      redirectUrl: "/wallet",
    };
  }

  async handleWebhook(provider: string, body: any) {
    const ref = body?.transactionId || body?.id || body?.trx_id;
    if (!ref) return { ok: false };
    await prisma.payment.updateMany({
      where: { externalRef: String(ref) },
      data: { status: "SUCCESS" },
    });
    return { ok: true };
  }

  async requestPayout(teacherId: string, amount: number, provider?: string) {
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