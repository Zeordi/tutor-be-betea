import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { BadgesService } from "../badges/badges.service";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class VerificationService {
  constructor(
    private readonly badgesService: BadgesService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getPendingQueue() {
    return prisma.vaultDocument.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
    });
  }

  async approveDocument(params: {
    documentId: string;
    adminId: string;
    issueBadges?: string[];
  }) {
    const doc = await prisma.vaultDocument.findUnique({
      where: { id: params.documentId },
    });

    if (!doc) throw new NotFoundException("Document not found");

    await prisma.vaultDocument.update({
      where: { id: params.documentId },
      data: { status: "APPROVED" },
    });

    const updateData: any = {};
    if (doc.documentType === "NATIONAL_ID" || doc.documentType === "PASSPORT") {
      updateData.isIdVerified = true;
    }
    if (doc.documentType === "DEGREE" || doc.documentType === "TRANSCRIPT") {
      updateData.isEduVerified = true;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.teacherProfile.update({
        where: { userId: doc.teacherId },
        data: updateData,
      });
    }

    if (params.issueBadges?.length) {
      for (const badge of params.issueBadges) {
        await this.badgesService.issueBadge({
          teacherId: doc.teacherId,
          badgeType: badge,
        });
      }
    }

    await this.notificationsService.create({
      userId: doc.teacherId,
      type: "VERIFICATION_UPDATE",
      title: "Verification Approved",
      body: "Your documents were approved. Trust badges have been added.",
    });

    return { success: true };
  }

  async rejectDocument(documentId: string, reason: string) {
    const doc = await prisma.vaultDocument.findUnique({
      where: { id: documentId },
    });

    if (!doc) throw new NotFoundException("Document not found");

    await prisma.vaultDocument.update({
      where: { id: documentId },
      data: { status: "REJECTED" },
    });

    await this.notificationsService.create({
      userId: doc.teacherId,
      type: "VERIFICATION_UPDATE",
      title: "Verification Rejected",
      body: reason || "Please re-submit clearer documents.",
    });

    return { success: true };
  }
}
