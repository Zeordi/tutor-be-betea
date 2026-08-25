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
  }) {
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

    // Prevent double open check-in
    const openSession = await prisma.attendanceLog.findFirst({
      where: {
        contractId: params.contractId,
        checkOutTime: null,
      },
    });
    if (openSession) {
      throw new BadRequestException("You already have an open session");
    }

    // Geofence validation (150m)
    // If parent location is not provided, mark as unverified distance 0 for now
    let distanceMeters = 0;
    let isVerifiedGeofence = true;

    if (
      typeof params.parentLat === "number" &&
      typeof params.parentLng === "number"
    ) {
      const geo = isWithinGeofence(
        params.latitude,
        params.longitude,
        params.parentLat,
        params.parentLng,
        150
      );
      distanceMeters = geo.distanceMeters;
      isVerifiedGeofence = geo.isWithin;
    }

    return prisma.attendanceLog.create({
      data: {
        contractId: params.contractId,
        checkInTime: new Date(),
        distanceMeters,
        isVerifiedGeofence,
        parentConfirmed: false,
      },
    });
  }

  async checkOut(params: {
    teacherId: string;
    contractId: string;
    latitude: number;
    longitude: number;
  }) {
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

    return prisma.attendanceLog.update({
      where: { id: openSession.id },
      data: {
        checkOutTime: new Date(),
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