import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { randomUUID } from "crypto";
import { calculateDistanceMeters, GEOFENCE_RADIUS_METERS } from "@tutor/geo";
import { validateOfflineId, validateClientCreatedAt } from "@tutor/validators";
import { OperationalException } from "../../common/exceptions/operational-exception";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class AttendanceService {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  async checkIn(
    contractId: string,
    teacherId: string,
    latitude: number,
    longitude: number,
    offlineId?: string,
    clientCreatedAt?: string,
    parentLat?: number,
    parentLng?: number,
  ) {
    const contract = await prisma.tutoringContract.findFirst({
      where: { id: contractId, teacherId },
    });
    if (!contract) throw new NotFoundException("Contract not found");

    if (!validateOfflineId(offlineId)) {
      throw new OperationalException("Invalid offlineId format");
    }
    if (!validateClientCreatedAt(clientCreatedAt)) {
      throw new OperationalException("clientCreatedAt is too old (>24h)");
    }

    if (offlineId) {
      const existing = await prisma.attendanceLog.findUnique({
        where: { offlineId },
      });
      if (existing) return existing;
    }

    let distanceMeters = 0;
    let isVerifiedGeofence = true;

    const centerLat = parentLat ?? contract.sessionLatitude?.toNumber() ?? null;
    const centerLng = parentLng ?? contract.sessionLongitude?.toNumber() ?? null;

    if (centerLat != null && centerLng != null) {
      distanceMeters = calculateDistanceMeters(latitude, longitude, centerLat, centerLng);
      isVerifiedGeofence = distanceMeters <= GEOFENCE_RADIUS_METERS;
    }

    const log = await prisma.attendanceLog.create({
      data: {
        contractId,
        teacherId,
        checkInTime: new Date(),
        distanceMeters,
        isVerifiedGeofence,
        requiresManualConfirm: !isVerifiedGeofence,
        parentConfirmed: false,
        offlineId: offlineId || randomUUID(),
        teacherLatitude: latitude,
        teacherLongitude: longitude,
      },
    });

    if (contract.status === "PENDING_ESCROW") {
      await prisma.tutoringContract.update({
        where: { id: contractId },
        data: { status: "ACTIVE" },
      });
    }

    return log;
  }

  async checkOut(contractId: string, teacherId: string) {
    const contract = await prisma.tutoringContract.findFirst({
      where: { id: contractId, teacherId },
    });
    if (!contract) throw new NotFoundException("Contract not found");

    const log = await prisma.attendanceLog.findFirst({
      where: { contractId, teacherId, checkOutTime: null },
      orderBy: { checkInTime: "desc" },
    });
    if (!log) throw new NotFoundException("Active check-in not found");

    const now = new Date();
    const checkIn = log.checkInTime;
    const maxDurationMs = 4 * 60 * 60 * 1000;
    const durationMs = now.getTime() - checkIn.getTime();
    const exceedsMax = durationMs > maxDurationMs;

    const updated = await prisma.attendanceLog.update({
      where: { id: log.id },
      data: { checkOutTime: now },
    });

    if (exceedsMax) {
      await prisma.riskFlag.create({
        data: {
          userId: teacherId,
          createdBy: "system",
          severity: "MEDIUM",
          reason: `Session exceeded 4h max duration (${Math.round(durationMs / 3600000)}h)`,
        },
      });

      await this.notificationsService.createNotification(teacherId, {
        type: "RISK_FLAG",
        title: "Session duration warning",
        body: `Your recent session exceeded the 4-hour maximum (${Math.round(durationMs / 3600000)}h). This has been logged.`,
      });
    }

    return updated;
  }

  async getContractAttendance(contractId: string) {
    return prisma.attendanceLog.findMany({
      where: { contractId },
      orderBy: { checkInTime: "desc" },
    });
  }

  async parentConfirm(attendanceId: string, parentId: string) {
    const log = await prisma.attendanceLog.findUnique({
      where: { id: attendanceId },
      include: { contract: true },
    });
    if (!log || log.contract.parentId !== parentId) {
      throw new NotFoundException("Attendance not found");
    }
    return prisma.attendanceLog.update({
      where: { id: attendanceId },
      data: { parentConfirmed: true },
    });
  }
}
