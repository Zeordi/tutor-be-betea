import { Injectable } from "@nestjs/common";
import { createHmac } from "crypto";
import { prisma } from "@tutor/database";

@Injectable()
export class AuditService {
  private chainSecret(): string {
    return (
      process.env.AUDIT_CHAIN_SECRET ||
      process.env.JWT_SECRET ||
      "dev-audit-chain-secret-change-me"
    );
  }

  private hashPayload(input: string): string {
    return createHmac("sha256", this.chainSecret()).update(input).digest("hex");
  }

  /**
   * Immutable HMAC-chained admin audit entry.
   */
  async createLog(params: {
    adminId: string;
    actionType: string;
    targetUserId?: string;
    reason: string;
    ipAddress?: string;
    statePayload?: Record<string, unknown>;
  }) {
    const last = await prisma.adminAuditLog.findFirst({
      orderBy: { createdAt: "desc" },
      select: { currentHash: true },
    });

    const previousHash = last?.currentHash || "GENESIS";
    const payload = JSON.stringify({
      adminId: params.adminId,
      targetUserId: params.targetUserId || null,
      actionType: params.actionType,
      reason: params.reason,
      ipAddress: params.ipAddress || "127.0.0.1",
      statePayload: params.statePayload || {},
      previousHash,
      at: new Date().toISOString(),
    });

    const currentHash = this.hashPayload(payload);

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

  /** Backward-compatible alias used by older admin code */
  async logAdminAction(
    adminId: string,
    actionType: string,
    targetUserId?: string,
    reason?: string,
  ) {
    return this.createLog({
      adminId,
      actionType,
      targetUserId,
      reason: reason || actionType,
    });
  }

  async list(limit = 100) {
    return prisma.adminAuditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}