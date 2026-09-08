import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class AdminService {
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
    return prisma.user.findMany({
      where: { status: "PENDING_VERIFICATION" },
      include: { teacherProfile: true },
    });
  }

  async approveVerification(userId: string, adminId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { status: "ACTIVE" },
    });
    await prisma.adminAuditLog.create({
      data: {
        adminId,
        targetUserId: userId,
        actionType: "APPROVE_VERIFICATION",
        reason: "Fayda + Degree verified",
      },
    });
  }

  async flagRisk(userId: string, reason: string, adminId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { status: "SUSPENDED" },
    });
    await prisma.adminAuditLog.create({
      data: {
        adminId,
        targetUserId: userId,
        actionType: "FLAG_RISK",
        reason,
      },
    });
  }

  // Multi-child support for admin
  async getChildProfiles(parentId: string) {
    return prisma.studentProfile.findMany({
      where: { parentId },
      include: { contracts: true },
    });
  }
}