import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { stripe } from "../../lib/stripe";

@Injectable()
export class PaymentsService {
  async getParentWallet(parentId: string) {
    const contracts = await prisma.tutoringContract.findMany({
      where: { parentId, status: "ACTIVE" },
      include: { teacher: true },
    });

    return {
      balance: 0, // placeholder - in real version sum from escrow
      contracts,
    };
  }

  async initiatePayment(parentId: string, contractId: string, amount: number) {
    const contract = await prisma.tutoringContract.findUnique({
      where: { id: contractId },
    });
    if (!contract) throw new NotFoundException("Contract not found");

    // Hold escrow amount
    await prisma.tutoringContract.update({
      where: { id: contractId },
      data: {
        escrowHeldAmount: amount,
        status: "PENDING_ESCROW",
      },
    });

    // Telebirr / CBE Birr / M-Pesa / Stripe placeholder
    return {
      message: "Payment initiated",
      redirectUrl: "/wallet",
    };
  }

  async handleTelebirrWebhook(body: any) {
    const txRef = body.tx_ref || body.reference;
    if (!txRef) return { error: "Invalid webhook" };

    await prisma.tutoringContract.updateMany({
      where: { escrowHeldAmount: { gt: 0 } },
      data: {
        escrowHeldAmount: 0,
        status: "ACTIVE",
      },
    });

    return { success: true };
  }

  async getTeacherEarnings(teacherId: string) {
    const contracts = await prisma.tutoringContract.findMany({
      where: { teacherId, status: "COMPLETED" },
    });

    const total = contracts.reduce((sum, c) => sum + Number(c.agreedAmount), 0);
    return { totalEarnings: total, contracts };
  }
}