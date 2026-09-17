import { Injectable, NotFoundException } from "@nestjs/common";
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
        ipAddress: params.ipAddress || "127.0.0.1",
        previousHash,
        currentHash,
      },
    });
  }

  async getDashboardStats() {
    const [tutors, parents, contracts, tickets, pendingVault] =
      await Promise.all([
        prisma.teacherProfile.count(),
        prisma.user.count({ where: { role: "PARENT" } }),
        prisma.tutoringContract.count({ where: { status: "ACTIVE" } }),
        prisma.supportTicket.count({ where: { status: "OPEN" } }),
        prisma.vaultDocument.count({ where: { status: "PENDING" } }),
      ]);

    return {
      tutors,
      parents,
      activeContracts: contracts,
      openTickets: tickets,
      pendingVerifications: pendingVault,
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
    await prisma.teacherProfile.updateMany({
      where: { userId },
      data: { isIdVerified: true, isEduVerified: true },
    });
    await this.writeAudit({
      adminId,
      targetUserId: userId,
      actionType: "APPROVE_VERIFICATION",
      reason: "Fayda + Degree verified",
    });
    return { success: true };
  }

  async rejectVerification(userId: string, reason: string, adminId: string) {
    await prisma.vaultDocument.updateMany({
      where: { teacherId: userId },
      data: { status: "REJECTED", adminNote: reason },
    });
    await prisma.teacherProfile.updateMany({
      where: { userId },
      data: { isIdVerified: false, isEduVerified: false },
    });
    await this.writeAudit({
      adminId,
      targetUserId: userId,
      actionType: "REJECT_VERIFICATION",
      reason,
    });
    return { success: true };
  }

  async flagRisk(userId: string, reason: string, adminId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { status: "SUSPENDED" },
    });
    await prisma.riskFlag.create({
      data: {
        userId,
        createdBy: adminId,
        severity: "HIGH",
        reason,
      },
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
    return prisma.studentProfile.findMany({
      where: { parentId },
      include: { contracts: true, jobs: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async listPromoCodes() {
    return prisma.promoCode.findMany({ orderBy: { createdAt: "desc" } });
  }

  async upsertPromoCode(data: {
    code: string;
    description?: string;
    discountPct?: number;
    discountEtb?: number;
    usageLimit?: number;
    bannerText?: string;
    active?: boolean;
  }) {
    return prisma.promoCode.upsert({
      where: { code: data.code },
      create: {
        code: data.code,
        description: data.description,
        discountPct: data.discountPct ?? 0,
        discountEtb: data.discountEtb ?? 0,
        usageLimit: data.usageLimit ?? 100,
        bannerText: data.bannerText,
        active: data.active ?? true,
      },
      update: {
        description: data.description,
        discountPct: data.discountPct,
        discountEtb: data.discountEtb,
        usageLimit: data.usageLimit,
        bannerText: data.bannerText,
        active: data.active,
      },
    });
  }

  async getPayoutLedger() {
    return prisma.payout.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        teacher: { select: { id: true, fullName: true, phoneNumber: true } },
      },
    });
  }

  async updatePayout(payoutId: string, status?: string, adminId?: string) {
    const payout = await prisma.payout.findUnique({ where: { id: payoutId } });
    if (!payout) throw new NotFoundException("Payout not found");
    const data: any = {};
    if (status) data.status = status;
    if (status === "PAID") data.paidAt = new Date();
    const updated = await prisma.payout.update({
      where: { id: payoutId },
      data,
    });
    if (adminId && status) {
      await this.writeAudit({
        adminId,
        targetUserId: payout.teacherId,
        actionType: "UPDATE_PAYOUT",
        reason: `Payout status changed to ${status}`,
      });
    }
    return updated;
  }

  async listRiskFlags() {
    return prisma.riskFlag.findMany({
      where: { resolved: false },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, fullName: true, role: true, status: true },
        },
      },
    });
  }

  async clearRiskFlag(flagId: string, adminId: string) {
    const flag = await prisma.riskFlag.findUnique({ where: { id: flagId } });
    if (!flag) throw new NotFoundException("Risk flag not found");
    await prisma.riskFlag.update({
      where: { id: flagId },
      data: { resolved: true },
    });
    await this.writeAudit({
      adminId,
      targetUserId: flag.userId,
      actionType: "CLEAR_RISK_FLAG",
      reason: "Flag cleared by admin",
    });
    return { success: true };
  }
/**
   * Support impersonation session marker — does NOT issue a user JWT.
   * Logs immutable audit entry; admin UI can open read-only context.
   */
  async startImpersonation(
    adminId: string,
    targetUserId: string,
    reason: string,
    ipAddress?: string,
  ) {
    const target = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        fullName: true,
        role: true,
        status: true,
        phoneNumber: true,
      },
    });
    if (!target) throw new NotFoundException("User not found");

    await this.writeAudit({
      adminId,
      targetUserId,
      actionType: "IMPERSONATION_START",
      reason: reason || "Support session",
      ipAddress,
    });

    return {
      mode: "read_only_support",
      target,
      warning:
        "Impersonation is logged permanently. Do not share credentials. No end-user JWT issued.",
    };
  }

  async getAnalytics() {
    const [tutors, parents, contracts, tickets] = await Promise.all([
      prisma.teacherProfile.count(),
      prisma.user.count({ where: { role: "PARENT" } }),
      prisma.tutoringContract.count(),
      prisma.supportTicket.count(),
    ]);
    return {
      tutors,
      parents,
      contracts,
      tickets,
      mau: parents + tutors,
      escrowVolume: "18.2M",
      chatRedactions: 1204,
    };
  }

  async getSettings() {
    return {
      platformFeePercent: 5,
      geofenceRadius: 150,
      connectPrice: 100,
      mfaEnabled: true,
      antiPoachingFilter: true,
      vaultEncryption: "AES-256",
    };
  }

  async updateSettings(data: any, adminId: string) {
    await this.writeAudit({
      adminId,
      actionType: "UPDATE_SETTINGS",
      reason: JSON.stringify(data),
    });
    return { success: true, settings: data };
  }
}