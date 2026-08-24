import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class PaymentsService {
  /**
   * Parent wallet summary
   */
  async getParentWallet(userId: string) {
    // Contracts where this user is the parent
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

    // If you later add a real transactions table, replace this mapping
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
      availableBalance: 0, // parents usually don't hold payout balance
      escrowBalance,
      totalSpent,
      transactions,
    };
  }

  /**
   * Teacher earnings summary
   */
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

    // For now, available balance = completed net earnings
    // Later: subtract already paid-out amounts from a payouts table
    const availableBalance = totalEarned;

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
      availableBalance,
      pendingEscrow,
      totalEarned,
      payouts,
    };
  }
}