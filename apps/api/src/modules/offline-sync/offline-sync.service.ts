import { Injectable, Logger } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { validateOfflineId, validateClientCreatedAt } from "@tutor/validators";
import { OperationalException } from "../../common/exceptions/operational-exception";

@Injectable()
export class OfflineSyncService {
  private readonly logger = new Logger("OfflineSync");

  async syncAttendanceLog(payload: any, userId: string) {
    if (!payload?.contractId) {
      throw new OperationalException("contractId is required");
    }

    if (!validateOfflineId(payload.offlineId)) {
      throw new OperationalException("Invalid offlineId format");
    }

    if (!validateClientCreatedAt(payload.clientCreatedAt)) {
      throw new OperationalException("clientCreatedAt is too old (>24h)");
    }

    if (payload.offlineId) {
      const existing = await prisma.attendanceLog.findUnique({
        where: { offlineId: payload.offlineId },
      });
      if (existing) {
        this.logger.log(
          `Offline attendance replay: offlineId=${payload.offlineId}, attendanceId=${existing.id}`,
        );
        return { ...existing, replayed: true };
      }
    }

    const teacherId = payload.teacherId || userId;

    const existingActive = await prisma.attendanceLog.findFirst({
      where: {
        contractId: payload.contractId,
        teacherId,
        checkOutTime: null,
      },
      orderBy: { checkInTime: "desc" },
    });

    if (existingActive) {
      const activeDay = new Date(existingActive.checkInTime).toDateString();
      const requestDay = payload.clientCreatedAt
        ? new Date(payload.clientCreatedAt).toDateString()
        : new Date().toDateString();

      if (activeDay === requestDay) {
        throw new OperationalException(
          "An active check-in already exists for this contract and teacher",
          409,
        );
      }
    }

    try {
      const created = await prisma.attendanceLog.create({
        data: {
          contractId: payload.contractId,
          teacherId,
          checkInTime: payload.checkInTime
            ? new Date(payload.checkInTime)
            : new Date(),
          checkOutTime: payload.checkOutTime
            ? new Date(payload.checkOutTime)
            : null,
          distanceMeters: payload.distanceMeters ?? 0,
          isVerifiedGeofence: payload.isVerifiedGeofence ?? false,
          parentConfirmed: false,
          offlineId: payload.offlineId || null,
          clientCreatedAt: payload.clientCreatedAt
            ? new Date(payload.clientCreatedAt)
            : new Date(),
          teacherLatitude: payload.teacherLatitude ?? null,
          teacherLongitude: payload.teacherLongitude ?? null,
        },
      });

      return { ...created, replayed: false };
    } catch (err: any) {
      if (err?.code === "P2002" && payload.offlineId) {
        const existing = await prisma.attendanceLog.findUnique({
          where: { offlineId: payload.offlineId },
        });
        if (existing) {
          this.logger.log(
            `Offline attendance replay after P2002: offlineId=${payload.offlineId}`,
          );
          return { ...existing, replayed: true };
        }
        throw new OperationalException("Duplicate offline attendance", 409);
      }
      this.logger.error(
        `Offline sync error: ${err?.message || err}`,
        err?.stack,
      );
      throw new OperationalException("Failed to sync attendance log");
    }
  }

  async syncProgressReport(contractId: string, payload: any) {
    if (!contractId) throw new OperationalException("contractId is required");
    if (payload.weekNumber == null) {
      throw new OperationalException("weekNumber is required");
    }

    if (payload.offlineId) {
      const existing = await prisma.progressReport.findFirst({
        where: { offlineId: payload.offlineId },
      });
      if (existing) {
        this.logger.log(
          `Offline progress replay: offlineId=${payload.offlineId}, progressId=${existing.id}`,
        );
        return { ...existing, replayed: true };
      }
    }

    try {
      const created = await prisma.progressReport.create({
        data: {
          contractId,
          weekNumber: Number(payload.weekNumber),
          topicsCovered: payload.topicsCovered || "",
          quizScore: payload.quizScore ?? null,
          strengthsNotes: payload.strengthsNotes,
          improvementAreas: payload.improvementAreas,
          aiSummary: payload.aiSummary,
          nextSessionPlan: payload.nextSessionPlan,
          offlineId: payload.offlineId || null,
        },
      });

      return { ...created, replayed: false };
    } catch (err: any) {
      if (err?.code === "P2002" && payload.offlineId) {
        const existing = await prisma.progressReport.findFirst({
          where: { offlineId: payload.offlineId },
        });
        if (existing) {
          this.logger.log(
            `Offline progress replay after P2002: offlineId=${payload.offlineId}`,
          );
          return { ...existing, replayed: true };
        }
        throw new OperationalException("Duplicate offline progress report", 409);
      }
      this.logger.error(
        `Offline sync error: ${err?.message || err}`,
        err?.stack,
      );
      throw new OperationalException("Failed to sync progress report");
    }
  }

  async syncSupportTicket(
    contractId: string | null | undefined,
    userId: string,
    body: any,
  ) {
    if (!body?.reasonType || !body?.explanation) {
      throw new OperationalException("reasonType and explanation are required");
    }

    if (body.offlineId) {
      const existing = await prisma.supportTicket.findFirst({
        where: { offlineId: body.offlineId },
      });
      if (existing) {
        this.logger.log(
          `Offline support replay: offlineId=${body.offlineId}, ticketId=${existing.id}`,
        );
        return { ...existing, replayed: true };
      }
    }

    try {
      const created = await prisma.supportTicket.create({
        data: {
          contractId: contractId || null,
          submittedBy: userId,
          reasonType: body.reasonType,
          explanation: body.explanation,
          evidenceAttachmentUrls: body.evidenceAttachmentUrls || [],
          status: "OPEN",
          offlineId: body.offlineId || null,
        },
      });

      return { ...created, replayed: false };
    } catch (err: any) {
      if (err?.code === "P2002" && body.offlineId) {
        const existing = await prisma.supportTicket.findFirst({
          where: { offlineId: body.offlineId },
        });
        if (existing) {
          this.logger.log(
            `Offline support replay after P2002: offlineId=${body.offlineId}`,
          );
          return { ...existing, replayed: true };
        }
        throw new OperationalException("Duplicate offline support ticket", 409);
      }
      this.logger.error(
        `Offline sync error: ${err?.message || err}`,
        err?.stack,
      );
      throw new OperationalException("Failed to sync support ticket");
    }
  }
}
