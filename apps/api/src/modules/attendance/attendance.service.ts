import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { prisma } from "@tutor/database";
import { isWithinGeofence } from "@tutor/geo";

@Injectable()
export class AttendanceService {
  async checkIn(params: {
    teacherId: string;
    contractId: string;
    latitude: number;
    longitude: number;
    parentLat?: number;
    parentLng?: number;
    offlineId?: string;
    clientCreatedAt?: string;
    distanceMeters?: number;
    isVerifiedGeofence?: boolean;
  }) {
    // Idempotent offline replay
    if (params.offlineId) {
      const existing = await prisma.attendanceLog.findUnique({
        where: { offlineId: params.offlineId },
      });
      if (existing) {
        return {
          ...existing,
          replayed: true,
          message: "Offline check-in already synced",
        };
      }
    }

    const contract = await prisma.tutoringContract.findUnique({
      where: { id: params.contractId },
    });

    if (!contract) throw new NotFoundException("Contract not found");
    if (contract.teacherId !== params.teacherId) {
      throw new ForbiddenException("Not your contract");
    }
    if (contract.status !== "ACTIVE") {
      throw new BadRequestException("Contract is not active");
    }

    const openSession = await prisma.attendanceLog.findFirst({
      where: { contractId: params.contractId, checkOutTime: null },
    });
    if (openSession) {
      // If offline retry after success, return open session instead of hard fail
      if (params.offlineId) {
        return {
          ...openSession,
          replayed: true,
          message: "Open session already exists",
        };
      }
      throw new BadRequestException("You already have an open session");
    }

    // Prefer contract session location, then body parentLat/Lng
    const homeLat =
      params.parentLat ??
      (contract.sessionLatitude != null
        ? Number(contract.sessionLatitude)
        : undefined);
    const homeLng =
      params.parentLng ??
      (contract.sessionLongitude != null
        ? Number(contract.sessionLongitude)
        : undefined);

    let distanceMeters = params.distanceMeters ?? 0;
    let isVerifiedGeofence = params.isVerifiedGeofence ?? true;

    if (typeof homeLat === "number" && typeof homeLng === "number") {
      const geo = isWithinGeofence(
        params.latitude,
        params.longitude,
        homeLat,
        homeLng,
        150,
      );
      distanceMeters = geo.distanceMeters;
      isVerifiedGeofence = geo.isWithin;
    }

    const checkInTime = params.clientCreatedAt
      ? new Date(params.clientCreatedAt)
      : new Date();

    const created = await prisma.attendanceLog.create({
      data: {
        contractId: params.contractId,
        checkInTime,
        distanceMeters,
        isVerifiedGeofence,
        parentConfirmed: false,
        offlineId: params.offlineId || null,
        clientCreatedAt: params.clientCreatedAt
          ? new Date(params.clientCreatedAt)
          : null,
        teacherLatitude: params.latitude,
        teacherLongitude: params.longitude,
      },
    });

    return {
      ...created,
      distanceMeters: Number(created.distanceMeters),
      isWithinGeofence: created.isVerifiedGeofence,
      message: created.isVerifiedGeofence
        ? "Checked in within geofence"
        : "Checked in outside geofence — parent confirmation required",
      sessionHome: {
        latitude: homeLat ?? null,
        longitude: homeLng ?? null,
      },
    };
  }

  async checkOut(params: {
    teacherId: string;
    contractId: string;
    latitude: number;
    longitude: number;
    offlineId?: string;
    clientCreatedAt?: string;
  }) {
    // Idempotent: offline checkout id already applied
    if (params.offlineId) {
      const existing = await prisma.attendanceLog.findFirst({
        where: {
          contractId: params.contractId,
          offlineId: params.offlineId,
          checkOutTime: { not: null },
        },
      });
      if (existing) {
        return {
          ...existing,
          replayed: true,
          message: "Offline check-out already synced",
        };
      }
    }

    const contract = await prisma.tutoringContract.findUnique({
      where: { id: params.contractId },
    });

    if (!contract) throw new NotFoundException("Contract not found");
    if (contract.teacherId !== params.teacherId) {
      throw new ForbiddenException("Not your contract");
    }

    const openSession = await prisma.attendanceLog.findFirst({
      where: {
        contractId: params.contractId,
        checkOutTime: null,
      },
      orderBy: { checkInTime: "desc" },
    });

    if (!openSession) {
      throw new BadRequestException("No open session to check out");
    }

    const checkOutTime = params.clientCreatedAt
      ? new Date(params.clientCreatedAt)
      : new Date();

    return prisma.attendanceLog.update({
      where: { id: openSession.id },
      data: {
        checkOutTime,
        // Keep original offlineId on check-in row; store checkout offline id only if empty
        offlineId: openSession.offlineId || params.offlineId || null,
        teacherLatitude: params.latitude,
        teacherLongitude: params.longitude,
      },
    });
  }

  async getByContract(contractId: string) {
    return prisma.attendanceLog.findMany({
      where: { contractId },
      orderBy: { checkInTime: "desc" },
    });
  }

  async confirmByParent(attendanceId: string, parentId: string) {
    const log = await prisma.attendanceLog.findUnique({
      where: { id: attendanceId },
    });
    if (!log) throw new NotFoundException("Attendance log not found");

    const contract = await prisma.tutoringContract.findUnique({
      where: { id: log.contractId },
    });
    if (!contract) throw new NotFoundException("Contract not found");
    if (contract.parentId !== parentId) {
      throw new ForbiddenException("Not your contract");
    }
    if (!log.checkOutTime) {
      throw new BadRequestException("Session is still in progress");
    }

    return prisma.attendanceLog.update({
      where: { id: attendanceId },
      data: { parentConfirmed: true },
    });
  }
}