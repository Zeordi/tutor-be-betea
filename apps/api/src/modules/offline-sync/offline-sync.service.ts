import {
  Injectable,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class OfflineSyncService {
  /**
   * Idempotent attendance sync.
   * Same offlineId → return existing row (no duplicate).
   */
  async syncAttendanceLog(payload: any, userId: string) {
    if (!payload?.contractId) {
      throw new BadRequestException("contractId is required");
    }

    if (payload.offlineId) {
      const existing = await prisma.attendanceLog.findUnique({
        where: { offlineId: payload.offlineId },
      });
      if (existing) {
        return { ...existing, replayed: true };
      }
    }

    try {
      const created = await prisma.attendanceLog.create({
        data: {
          contractId: payload.contractId,
          teacherId: payload.teacherId || userId,
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
        if (existing) return { ...existing, replayed: true };
        throw new ConflictException("Duplicate offline attendance");
      }
      throw err;
    }
  }

  async syncProgressReport(contractId: string, payload: any) {
    if (!contractId) throw new BadRequestException("contractId is required");
    if (payload.weekNumber == null) {
      throw new BadRequestException("weekNumber is required");
    }

    return prisma.progressReport.create({
      data: {
        contractId,
        weekNumber: Number(payload.weekNumber),
        topicsCovered: payload.topicsCovered || "",
        quizScore: payload.quizScore ?? null,
        strengthsNotes: payload.strengthsNotes,
        improvementAreas: payload.improvementAreas,
        aiSummary: payload.aiSummary,
        nextSessionPlan: payload.nextSessionPlan,
      },
    });
  }
}