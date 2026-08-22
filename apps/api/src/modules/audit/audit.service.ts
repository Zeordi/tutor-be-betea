import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { createAuditHash } from "@tutor/audit";

@Injectable()
export class AuditService {
  async createLog(params: {
    adminId: string;
    actionType: string;
    targetUserId?: string;
    reason: string;
    ipAddress: string;
    statePayload?: Record<string, any>;
  }) {
    const previousLog = await prisma.adminAuditLog.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const previousHash = previousLog?.currentHash || "GENESIS";
    const logId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const currentHash = createAuditHash({
      logId,
      adminId: params.adminId,
      actionType: params.actionType,
      statePayload: params.statePayload || {},
      timestamp,
      previousHash,
    });

    return prisma.adminAuditLog.create({
      data: {
        id: logId,
        adminId: params.adminId,
        targetUserId: params.targetUserId,
        actionType: params.actionType,
        reason: params.reason,
        ipAddress: params.ipAddress,
        previousHash,
        currentHash,
      },
    });
  }

  async getLogs(limit = 50) {
    return prisma.adminAuditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
