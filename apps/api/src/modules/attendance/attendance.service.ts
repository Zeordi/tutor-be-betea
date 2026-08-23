import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { getGeofenceStatus, GEOFENCE_RADIUS_METERS } from "@tutor/geo";

@Injectable()
export class AttendanceService {
  async checkIn(params: {
    contractId: string;
    teacherId: string;
    latitude: number;
    longitude: number;
    parentLat: number;
    parentLng: number;
  }) {
    const contract = await prisma.tutoringContract.findUnique({
      where: { id: params.contractId },
    });

    if (!contract) throw new NotFoundException("Contract not found");
    if (contract.teacherId !== params.teacherId) {
      throw new BadRequestException("You are not assigned to this contract");
    }
    if (contract.status !== "ACTIVE") {
      throw new BadRequestException("Contract is not active");
    }

    const geoStatus = getGeofenceStatus(
      params.latitude,
      params.longitude,
      params.parentLat,
      params.parentLng,
    );

    const log = await prisma.attendanceLog.create({
      data: {
        contractId: params.contractId,
        checkInTime: new Date(),
        distanceMeters: geoStatus.distanceMeters,
        isVerifiedGeofence: geoStatus.isVerified,
        parentConfirmed: false,
      },
    });

    return {
      attendanceLogId: log.id,
      distanceMeters: geoStatus.distanceMeters,
      isWithinGeofence: geoStatus.isVerified,
      requiresManualConfirmation: geoStatus.requiresManualConfirmation,
      message: geoStatus.isVerified
        ? "Check-in successful – within geofence"
        : `Check-in recorded but you are ${geoStatus.distanceMeters}m away (limit: ${GEOFENCE_RADIUS_METERS}m). Parent confirmation required.`,
    };
  }

  async checkOut(params: {
    attendanceLogId: string;
    teacherId: string;
    latitude: number;
    longitude: number;
  }) {
    const log = await prisma.attendanceLog.findUnique({
      where: { id: params.attendanceLogId },
    });

    if (!log) throw new NotFoundException("Attendance log not found");
    if (log.checkOutTime) {
      throw new BadRequestException("Already checked out");
    }

    const updated = await prisma.attendanceLog.update({
      where: { id: params.attendanceLogId },
      data: {
        checkOutTime: new Date(),
      },
    });

    return updated;
  }

  async parentConfirm(attendanceLogId: string, parentId: string) {
    // Parent manually confirms a session that was outside geofence
    const log = await prisma.attendanceLog.findUnique({
      where: { id: attendanceLogId },
    });

    if (!log) throw new NotFoundException("Attendance log not found");

    return prisma.attendanceLog.update({
      where: { id: attendanceLogId },
      data: {
        parentConfirmed: true,
        isVerifiedGeofence: true,
      },
    });
  }

  async getContractAttendance(contractId: string) {
    return prisma.attendanceLog.findMany({
      where: { contractId },
      orderBy: { checkInTime: "desc" },
    });
  }
}
