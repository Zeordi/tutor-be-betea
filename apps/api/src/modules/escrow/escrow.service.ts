import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class EscrowService {
  /**
   * Release funds to teacher after successful sessions
   * Platform fee is deducted
   */
  async releaseToTeacher(contract: {
    id: string;
    teacherId: string;
    agreedAmount: any;
    platformFeePercent: any;
    escrowHeldAmount: any;
  }) {
    const amount = Number(contract.agreedAmount);
    const feePercent = Number(contract.platformFeePercent);
    const platformFee = (amount * feePercent) / 100;
    const teacherAmount = amount - platformFee;

    // TODO: Call real payout API (Telebirr / CBE Birr / Bank)
    console.log(`[ESCROW] Releasing ETB ${teacherAmount} to teacher ${contract.teacherId}`);
    console.log(`[ESCROW] Platform fee: ETB ${platformFee}`);

    // Record that escrow has been released
    await prisma.tutoringContract.update({
      where: { id: contract.id },
      data: {
        escrowHeldAmount: 0,
      },
    });

    return { teacherAmount, platformFee };
  }

  async refundToParent(contractId: string, reason: string) {
    // Used when 14-day guarantee is claimed or dispute is won by parent
    console.log(`[ESCROW] Refunding contract ${contractId} – Reason: ${reason}`);
    // TODO: Real refund logic
  }
}
