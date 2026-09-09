import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { BadgesService } from "../badges/badges.service";
import { NotificationsService } from "../notifications/notifications.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class VerificationService {
  constructor(
    private readonly badgesService: BadgesService,
    private readonly notificationsService: NotificationsService,
    private readonly auditService: AuditService,
  ) {}

  async getPendingQueue() {
    return prisma.vaultDocument.findMany({
      where: { status: "PENDING" },
      select: {
        id: true,
        teacherId: true,
        documentType: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async approveDocument(params: {
    documentId: string;
    adminId: string;
    issueBadges?: string[];
    ipAddress?: string;
  }) {
    const doc = await prisma.vaultDocument.findUnique({
      where: { id: params.documentId },
    });
    if (!doc) throw new NotFoundException("Document not found");

    await prisma.vaultDocument.update({
      where: { id: params.documentId },
      data: { status: "APPROVED" },
    });

    const updateData: { isIdVerified?: boolean; isEduVerified?: boolean } = {};
    if (doc.documentType === "NATIONAL_ID" || doc.documentType === "PASSPORT") {
      updateData.isIdVerified = true;
    }
    if (doc.documentType === "DEGREE" || doc.documentType === "TRANSCRIPT") {
      updateData.isEduVerified = true;
    }

    if (Object.keys(updateData).length) {
      await prisma.teacherProfile.update({
        where: { userId: doc.teacherId },
        data: updateData,
      });
    }

    // Default badges if none provided
    const badges =
      params.issueBadges?.length
        ? params.issueBadges
        : doc.documentType === "NATIONAL_ID" || doc.documentType === "PASSPORT"
          ? ["NATIONAL_ID_VERIFIED"]
          : doc.documentType === "DEGREE" || doc.documentType === "TRANSCRIPT"
            ? ["DEGREE_VERIFIED"]
            : [];

    for (const badge of badges) {
      await this.badgesService.issueBadge({
        teacherId: doc.teacherId,
        badgeType: badge,
      });
    }

    await this.notificationsService.createNotification(doc.teacherId, {
      type: "VERIFICATION_UPDATE",
      title: "Verification Approved",
      body: "Your documents were approved. Trust badges have been added.",
    });

    await this.auditService.createLog({
      adminId: params.adminId,
      actionType: "APPROVE_VAULT_DOCUMENT",
      targetUserId: doc.teacherId,
      reason: `Approved ${doc.documentType}`,
      ipAddress: params.ipAddress,
      statePayload: { documentId: doc.id, badges },
    });

    return { success: true, badges };
  }

  async rejectDocument(params: {
    documentId: string;
    adminId: string;
    reason: string;
    ipAddress?: string;
  }) {
    const doc = await prisma.vaultDocument.findUnique({
      where: { id: params.documentId },
    });
    if (!doc) throw new NotFoundException("Document not found");

    await prisma.vaultDocument.update({
      where: { id: params.documentId },
      data: { status: "REJECTED" },
    });

    await this.notificationsService.createNotification(doc.teacherId, {
      type: "VERIFICATION_UPDATE",
      title: "Verification Rejected",
      body: params.reason || "Please re-submit clearer documents.",
    });

    await this.auditService.createLog({
      adminId: params.adminId,
      actionType: "REJECT_VAULT_DOCUMENT",
      targetUserId: doc.teacherId,
      reason: params.reason || "Rejected",
      ipAddress: params.ipAddress,
      statePayload: { documentId: doc.id },
    });

    return { success: true };
  }
}