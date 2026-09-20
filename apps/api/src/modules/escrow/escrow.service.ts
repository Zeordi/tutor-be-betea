import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { createHmac } from "crypto";

@Injectable()
export class EscrowService {
  private readonly logger = new Logger("Escrow");

  private chainSecret(): string {
    return (
      process.env.AUDIT_CHAIN_SECRET ||
      process.env.JWT_SECRET ||
      "dev-audit-chain-secret-change-me"
    );
  }

  private async writeAudit(params: {
    adminId?: string;
    targetUserId?: string;
    actionType: string;
    reason: string;
    ipAddress?: string;
  }) {
    const last = await prisma.adminAuditLog.findFirst({
      orderBy: { createdAt: "desc" },
      select: { currentHash: true },
    });
    const previousHash = last?.currentHash || "GENESIS";
    const payload = JSON.stringify({
      ...params,
      previousHash,
      at: new Date().toISOString(),
    });
    const currentHash = createHmac("sha256", this.chainSecret())
      .update(payload)
      .digest("hex");

    return prisma.adminAuditLog.create({
      data: {
        adminId: params.adminId || "system",
        targetUserId: params.targetUserId,
        actionType: params.actionType,
        reason: params.reason,
        ipAddress: params.ipAddress || "127.0.0.1",
        previousHash,
        currentHash,
      },
    });
  }

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
  async releaseFunds(contractId: string, adminId?: string) {
    const contract = await prisma.tutoringContract.findUnique({
      where: { id: contractId },
    });
    if (!contract) throw new NotFoundException("Contract not found");

    if (contract.status === "COMPLETED") {
      return contract;
    }

    if (!contract.escrowHeldAmount || Number(contract.escrowHeldAmount) <= 0) {
      throw new BadRequestException("No escrow held for this contract");
    }

    const openTickets = await prisma.supportTicket.count({
      where: {
        contractId,
        status: { in: ["OPEN", "UNDER_REVIEW"] },
      },
    });

    if (openTickets > 0) {
      throw new BadRequestException(
        "Cannot release escrow while support tickets are open for this contract",
      );
    }

    const updated = await prisma.tutoringContract.update({
      where: { id: contractId },
      data: {
        escrowHeldAmount: 0,
        status: "COMPLETED",
      },
    });

    await this.writeAudit({
      adminId,
      targetUserId: contract.teacherId,
      actionType: "RELEASE_ESCROW",
      reason: `Manual escrow release for contract ${contractId}`,
    });

    this.logger.log("Escrow released", {
      contractId,
      adminId: adminId || "system",
      teacherId: contract.teacherId,
      amount: contract.escrowHeldAmount,
    });

    return updated;
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
      if (!contract.escrowHeldAmount || Number(contract.escrowHeldAmount) <= 0) {
        continue;
      }

      const openTickets = await prisma.supportTicket.count({
        where: {
          contractId: contract.id,
          status: { in: ["OPEN", "UNDER_REVIEW"] },
        },
      });

      if (openTickets > 0) {
        continue;
      }

      const updated = await prisma.tutoringContract.update({
        where: { id: contract.id },
        data: {
          escrowHeldAmount: 0,
          status: "COMPLETED",
        },
      });

      await this.writeAudit({
        actionType: "AUTO_RELEASE_ESCROW",
        reason: `Auto-released expired contract ${contract.id}`,
      });

      this.logger.log("Escrow auto-released", {
        contractId: contract.id,
        teacherId: contract.teacherId,
        amount: contract.escrowHeldAmount,
      });

      results.push(updated);
    }

    return { released: results.length, contracts: results };
  }
}
