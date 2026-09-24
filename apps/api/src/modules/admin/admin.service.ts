import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { createHmac, randomBytes } from "crypto";
import * as bcrypt from "bcryptjs";

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

    const remaining = await prisma.riskFlag.count({
      where: { userId: flag.userId, resolved: false },
    });

    const user = await prisma.user.findUnique({ where: { id: flag.userId } });
    const wasSuspended = user?.status === "SUSPENDED";
    if (wasSuspended && remaining === 0) {
      await prisma.user.update({
        where: { id: flag.userId },
        data: { status: "ACTIVE" },
      });
    }

    await this.writeAudit({
      adminId,
      targetUserId: flag.userId,
      actionType: "CLEAR_RISK_FLAG",
      reason:
        remaining === 0
          ? "Flag cleared by admin — user reactivated (no remaining unresolved flags)"
          : `Flag cleared by admin — user remains SUSPENDED (${remaining} unresolved flag(s) remaining)`,
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

  async getRecentAttendance(limit = 50) {
    return prisma.attendanceLog.findMany({
      orderBy: { checkInTime: "desc" },
      take: limit,
      select: {
        id: true,
        contractId: true,
        teacherId: true,
        checkInTime: true,
        checkOutTime: true,
        distanceMeters: true,
        isVerifiedGeofence: true,
        parentConfirmed: true,
        createdAt: true,
      },
    });
  }

  async getChatFlags(limit = 50) {
    return prisma.chatMessage.findMany({
      where: { originalBlocked: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        roomId: true,
        senderId: true,
        content: true,
        createdAt: true,
      },
    });
  }

  private readonly STAFF_ROLES = ["SUPER_ADMIN", "SUPPORT_AGENT", "VERIFICATION_OFFICER", "FINANCE"];

  async listStaff() {
    return prisma.user.findMany({
      where: {
        role: { in: this.STAFF_ROLES as any },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async createStaff(adminId: string, body: any) {
    const { fullName, phoneNumber, email, role, temporaryPassword } = body || {};

    if (!fullName || !role) {
      throw new BadRequestException("fullName and role are required");
    }

    if (!this.STAFF_ROLES.includes(role)) {
      throw new BadRequestException("Role must be SUPER_ADMIN, SUPPORT_AGENT, VERIFICATION_OFFICER, or FINANCE");
    }

    if (!phoneNumber && !email) {
      throw new BadRequestException("phoneNumber or email is required");
    }

    const password = temporaryPassword || `tmp-${randomBytes(8).toString("hex")}`;
    const passwordHash = await bcrypt.hash(password, 10);

    const phone = (phoneNumber || `+staff-${Date.now()}`).trim();

    try {
      const user = await prisma.user.create({
        data: {
          phoneNumber: phone,
          email: email?.trim().toLowerCase() || undefined,
          fullName: fullName.trim(),
          role: role as any,
          passwordHash,
          emailVerified: true,
          phoneVerified: true,
          status: "ACTIVE",
        },
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });

      await this.writeAudit({
        adminId,
        targetUserId: user.id,
        actionType: "CREATE_STAFF",
        reason: `Created staff ${user.fullName} (${user.role})`,
      });

      return { ...user, temporaryPassword: password };
    } catch (e: any) {
      if (e?.code === "P2002") {
        throw new ConflictException("Email or phone number already exists");
      }
      throw e;
    }
  }

  async updateStaff(adminId: string, id: string, body: any) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("Staff member not found");
    }

    if (!this.STAFF_ROLES.includes(user.role)) {
      throw new BadRequestException("Target user is not a staff member");
    }

    const updateData: any = {};

    if (body.role && this.STAFF_ROLES.includes(body.role)) {
      updateData.role = body.role;
    }

    if (body.status && ["ACTIVE", "SUSPENDED"].includes(body.status)) {
      updateData.status = body.status;
    }

    if (body.temporaryPassword && body.temporaryPassword.length >= 6) {
      updateData.passwordHash = await bcrypt.hash(body.temporaryPassword, 10);
    } else if (body.temporaryPassword && body.temporaryPassword.length > 0 && body.temporaryPassword.length < 6) {
      throw new BadRequestException("temporaryPassword must be at least 6 characters");
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException("No valid fields to update");
    }

    let actionType = "UPDATE_STAFF";

    if (body.role && body.role !== user.role) {
      actionType = "ROLE_CHANGE";
    } else if (body.status && body.status !== user.status) {
      if (body.status === "SUSPENDED") {
        actionType = "SUSPEND_STAFF";
      } else if (body.status === "ACTIVE") {
        actionType = "ACTIVATE_STAFF";
      }
    } else if (body.temporaryPassword) {
      actionType = "RESET_STAFF_PASSWORD";
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    await this.writeAudit({
      adminId,
      targetUserId: id,
      actionType,
      reason: this.buildUpdateReason(user, updateData),
    });

    return { ...updated, temporaryPassword: body.temporaryPassword || undefined };
  }

  private generateTempPassword(): string {
    return `tmp-${randomBytes(8).toString("hex")}`;
  }

  private buildUpdateReason(oldUser: any, updateData: any): string {
    const parts: string[] = [];
    if (updateData.role) parts.push(`role: ${oldUser.role} -> ${updateData.role}`);
    if (updateData.status) parts.push(`status: ${oldUser.status} -> ${updateData.status}`);
    if (updateData.passwordHash) parts.push("password reset");
    return parts.join(", ");
  }
}