import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class EscrowService {
  async holdFunds(contractId: string, amount: number) {
    const contract = await prisma.tutoringContract.findUnique({
      where: { id: contractId },
    });
    if (!contract) throw new NotFoundException("Contract not found");

    return prisma.tutoringContract.update({
      where: { id: contractId },
      data: {
        escrowHeldAmount: amount,
        status: "PENDING_ESCROW",
      },
    });
  }

  /** Admin/finance release after verified sessions */
  async releaseFunds(contractId: string) {
    const contract = await prisma.tutoringContract.findUnique({
      where: { id: contractId },
    });
    if (!contract) throw new NotFoundException("Contract not found");

    return prisma.tutoringContract.update({
      where: { id: contractId },
      data: {
        escrowHeldAmount: 0,
        status: "COMPLETED",
      },
    });
  }

  /** Payment success → ACTIVE but keep escrow until release */
  async handlePaymentWebhook(contractId: string, _paymentProvider: string) {
    return prisma.tutoringContract.update({
      where: { id: contractId },
      data: { status: "ACTIVE" },
    });
  }

  /** Auto-release ACTIVE contracts whose end date has passed and are not disputed */
  async autoReleaseExpiredContracts() {
    const now = new Date();
    const expired = await prisma.tutoringContract.findMany({
      where: {
        status: "ACTIVE",
        endDate: { lt: now },
      },
    });

    const results = [];
    for (const contract of expired) {
      const updated = await prisma.tutoringContract.update({
        where: { id: contract.id },
        data: {
          escrowHeldAmount: 0,
          status: "COMPLETED",
        },
      });
      results.push(updated);
    }

    return { released: results.length, contracts: results };
  }
}