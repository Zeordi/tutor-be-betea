import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class OfflineSyncService {
  async syncAttendanceLog(payload: any, userId: string) {
    return prisma.attendanceLog.create({
      data: {
        contractId: payload.contractId,
        teacherId: userId,
        checkInTime: payload.checkInTime || new Date(),
        checkOutTime: payload.checkOutTime || null,
        distanceMeters: payload.distanceMeters || 0,
        isVerifiedGeofence: payload.isVerifiedGeofence || false,
        parentConfirmed: false,
        offlineId: payload.offlineId,
        clientCreatedAt: payload.clientCreatedAt || new Date(),
        teacherLatitude: payload.teacherLatitude,
        teacherLongitude: payload.teacherLongitude,
      },
    });
  }

  async syncProgressReport(contractId: string, payload: any) {
    return prisma.progressReport.create({
      data: {
        contractId,
        weekNumber: payload.weekNumber,
        topicsCovered: payload.topicsCovered,
        quizScore: payload.quizScore,
        strengthsNotes: payload.strengthsNotes,
        improvementAreas: payload.improvementAreas,
      },
    });
  }

  async syncSupportTicket(contractId: string, userId: string, payload: any) {
    return prisma.supportTicket.create({
      data: {
        contractId,
        submittedBy: userId,
        reasonType: payload.reasonType,
        explanation: payload.explanation,
        evidenceAttachmentUrls: payload.evidenceAttachmentUrls || [],
        status: "OPEN",
      },
    });
  }
}