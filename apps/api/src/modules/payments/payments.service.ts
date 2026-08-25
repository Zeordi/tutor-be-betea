import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class PaymentsService {
  // -------- Wallet / Earnings --------
  async getParentWallet(userId: string) {
    const contracts = await prisma.tutoringContract.findMany({
      where: { parentId: userId },
      select: {
        id: true,
        agreedAmount: true,
        escrowHeldAmount: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const escrowBalance = contracts
      .filter((c) => c.status === "ACTIVE" || c.status === "PENDING_ESCROW")
      .reduce((sum, c) => sum + Number(c.escrowHeldAmount || 0), 0);

    const totalSpent = contracts
      .filter((c) => c.status === "COMPLETED")
      .reduce((sum, c) => sum + Number(c.agreedAmount || 0), 0);

    const transactions = contracts.map((c) => ({
      id: c.id,
      type:
        c.status === "COMPLETED"
          ? "SESSION_PAYMENT"
          : c.status === "PENDING_ESCROW"
          ? "ESCROW_HOLD"
          : "CONTRACT",
      amount: Number(c.agreedAmount || 0),
      createdAt: c.createdAt,
    }));

    return {
      availableBalance: 0,
      escrowBalance,
      totalSpent,
      transactions,
    };
  }

  async getTeacherEarnings(userId: string) {
    const contracts = await prisma.tutoringContract.findMany({
      where: { teacherId: userId },
      select: {
        id: true,
        agreedAmount: true,
        escrowHeldAmount: true,
        platformFeePercent: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const pendingEscrow = contracts
      .filter((c) => c.status === "ACTIVE" || c.status === "PENDING_ESCROW")
      .reduce((sum, c) => sum + Number(c.escrowHeldAmount || 0), 0);

    const completed = contracts.filter((c) => c.status === "COMPLETED");

    const totalEarned = completed.reduce((sum, c) => {
      const amount = Number(c.agreedAmount || 0);
      const feePercent = Number(c.platformFeePercent || 10);
      const net = amount - (amount * feePercent) / 100;
      return sum + net;
    }, 0);

    const payouts = completed.map((c) => {
      const amount = Number(c.agreedAmount || 0);
      const feePercent = Number(c.platformFeePercent || 10);
      const net = amount - (amount * feePercent) / 100;

      return {
        id: c.id,
        amount: net,
        status: "RELEASED",
        createdAt: c.createdAt,
      };
    });

    return {
      availableBalance: totalEarned,
      pendingEscrow,
      totalEarned,
      payouts,
    };
  }

  // -------- Methods required by controller --------
  async initiatePayment(body: {
    contractId: string;
    amount?: number;
    provider?: "TELEBIRR" | "CBE_BIRR" | string;
    phoneNumber?: string;
  }) {
    // Placeholder until live payment provider is connected
    return {
      success: true,
      provider: body.provider || "TELEBIRR",
      contractId: body.contractId,
      amount: body.amount || 0,
      status: "PENDING",
      checkoutUrl: null,
      message:
        "Payment initiation placeholder. Connect Telebirr/CBE credentials to go live.",
    };
  }

  async handleWebhook(provider: "TELEBIRR" | "CBE_BIRR" | string, body: any) {
    // Placeholder webhook handler
    return {
      success: true,
      provider,
      received: true,
      data: body,
      message: "Webhook received. Implement provider signature verification next.",
    };
  }
}