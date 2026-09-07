import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class AuditService {
  async logAdminAction(adminId: string, actionType: string, targetUserId?: string, reason?: string) {
    return prisma.adminAuditLog.create({
      data: {
        adminId,
        targetUserId,
        actionType,
        reason,
        ipAddress: "127.0.0.1", // replace with real IP in production
      },
    });
  }
}