import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class EscrowService {
  async holdFunds(contractId: string, amount: number) {
    await prisma.tutoringContract.update({
      where: { id: contractId },
      data: {
        escrowHeldAmount: amount,
        status: "PENDING_ESCROW",
      },
    });
  }

  async releaseFunds(contractId: string) {
    await prisma.tutoringContract.update({
      where: { id: contractId },
      data: {
        escrowHeldAmount: 0,
        status: "COMPLETED",
      },
    });
  }

  async handlePaymentWebhook(contractId: string, paymentProvider: string) {
    await prisma.tutoringContract.update({
      where: { id: contractId },
      data: {
        status: "ACTIVE",
        escrowHeldAmount: 0,
      },
    });
  }
}