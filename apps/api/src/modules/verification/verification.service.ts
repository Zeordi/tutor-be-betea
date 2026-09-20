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

  async requestMoreInfo(params: {
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
      data: { status: "NEEDS_MORE_INFO", adminNote: params.reason },
    });

    await this.notificationsService.createNotification(doc.teacherId, {
      type: "VERIFICATION_UPDATE",
      title: "More Information Needed",
      body: params.reason || "Please provide additional documents.",
    });

    await this.auditService.createLog({
      adminId: params.adminId,
      actionType: "REQUEST_MORE_INFO_VAULT_DOCUMENT",
      targetUserId: doc.teacherId,
      reason: params.reason || "More info requested",
      ipAddress: params.ipAddress,
      statePayload: { documentId: doc.id },
    });

    return { success: true };
  }

  async revokeDocument(params: {
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
      data: { status: "REVOKED" },
    });

    const updateData: { isIdVerified?: boolean; isEduVerified?: boolean } = {};
    if (doc.documentType === "NATIONAL_ID" || doc.documentType === "PASSPORT") {
      updateData.isIdVerified = false;
    }
    if (doc.documentType === "DEGREE" || doc.documentType === "TRANSCRIPT") {
      updateData.isEduVerified = false;
    }

    if (Object.keys(updateData).length) {
      await prisma.teacherProfile.update({
        where: { userId: doc.teacherId },
        data: updateData,
      });
    }

    const badges = await prisma.trustBadge.findMany({
      where: {
        teacherId: doc.teacherId,
        badgeType: {
          in:
            doc.documentType === "NATIONAL_ID" || doc.documentType === "PASSPORT"
              ? ["NATIONAL_ID_VERIFIED"]
              : doc.documentType === "DEGREE" || doc.documentType === "TRANSCRIPT"
                ? ["DEGREE_VERIFIED"]
                : [],
        },
      },
    });

    for (const badge of badges) {
      await prisma.trustBadge.delete({ where: { id: badge.id } });
    }

    await this.notificationsService.createNotification(doc.teacherId, {
      type: "VERIFICATION_UPDATE",
      title: "Verification Revoked",
      body: params.reason || "Your verification has been revoked.",
    });

    await this.auditService.createLog({
      adminId: params.adminId,
      actionType: "REVOKE_VAULT_DOCUMENT",
      targetUserId: doc.teacherId,
      reason: params.reason || "Revoked",
      ipAddress: params.ipAddress,
      statePayload: { documentId: doc.id, badgesRemoved: badges.map((b) => b.badgeType) },
    });

    return { success: true };
  }

  async getTeacherVerificationStatus(teacherId: string) {
    const docs = await prisma.vaultDocument.findMany({
      where: { teacherId },
      select: {
        id: true,
        documentType: true,
        status: true,
        adminNote: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const latestNote = docs.find((d) => d.adminNote);

    return {
      docs: docs.map((doc) => ({
        id: doc.id,
        label: doc.documentType.replace(/_/g, " "),
        status: doc.status.toLowerCase(),
        statusLabel: doc.status.replace(/_/g, " "),
        note: doc.adminNote || undefined,
        icon: doc.documentType === "NATIONAL_ID" ? "🪪" : doc.documentType === "DEGREE" ? "🎓" : doc.documentType === "LIVENESS_SELFIE" ? "📸" : "📄",
      })),
      adminNote: latestNote?.adminNote || "",
      adminNoteDate: latestNote?.createdAt || "",
      adminNoteAuthor: "TBB Verification Team",
    };
  }
}