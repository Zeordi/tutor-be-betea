import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { createHmac } from "crypto";

@Injectable()
export class AdminService {
  private chainSecret(): string {
    return (
      process.env.AUDIT_CHAIN_SECRET ||
      process.env.JWT_SECRET ||
      "dev-audit-chain-secret-change-me"
    );
  }

  private async writeAudit(params: {
    adminId: string;
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
        adminId: params.adminId,
        targetUserId: params.targetUserId,
        actionType: params.actionType,
        reason: params.reason,
       ,
        ipAddress: params.ipAddress || "127.0.0.1",
        previousHash,
        currentHash,
      },
    });
  }

  async getDashboardStats() {
    const [tutors, parents, contracts, tickets] = await Promise.all([
      prisma.teacherProfile.count(),
      prisma.user.count({ where: { role: "PARENT" } }),
      prisma.tutoringContract.count(),
      prisma.supportTicket.count(),
    ]);

    return {
      tutors,
      parents,
      activeContracts: contracts,
      openTickets: tickets,
    };
  }

  async getAuditLogs(limit = 100) {
    return prisma.adminAuditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async getVerificationQueue() {
    return prisma.vaultDocument.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 100,
    });
  }

  async approveVerification(userId: string, adminId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { status: "ACTIVE" },
    });
    await this.writeAudit({
      adminId,
      targetUserId: userId,
      actionType: "APPROVE_VERIFICATION",
      reason: "Fayda + Degree verified",
    });
    return { success: true };
  }

  async flagRisk(userId: string, reason: string, adminId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { status: "SUSPENDED" },
    });
    await this.writeAudit({
      adminId,
      targetUserId: userId,
      actionType: "FLAG_RISK",
      reason,
    });
    return { success: true };
  }

  async getChildProfiles(parentId: string) {
    // Schema has no contracts relation on StudentProfile
    return prisma.studentProfile.findMany({
      where: { parentId },
    });
  }

  async getPayoutLedger() {
    return prisma.tutoringContract.findMany({
      where: { status: "COMPLETED" },
      select: { teacherId: true, agreedAmount: true, status: true },
    });
  }
}