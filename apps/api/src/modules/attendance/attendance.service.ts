import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { randomUUID } from "crypto";

@Injectable()
export class AttendanceService {
  async checkIn(
    contractId: string,
    teacherId: string,
    latitude: number,
    longitude: number,
  ) {
    const contract = await prisma.tutoringContract.findFirst({
      where: { id: contractId, teacherId },
    });
    if (!contract) throw new NotFoundException("Contract not found");

    const log = await prisma.attendanceLog.create({
      data: {
        contractId,
        checkInTime: new Date(),
        checkOutTime: null,
        distanceMeters: 0,
        isVerifiedGeofence: true,
        parentConfirmed: false,
        offlineId: randomUUID(),
        teacherLatitude: latitude,
        teacherLongitude: longitude,
      },
    });

    await prisma.tutoringContract.update({
      where: { id: contractId },
      data: { status: "ACTIVE" },
    });

    return log;
  }

  async checkOut(contractId: string, teacherId: string) {
    const contract = await prisma.tutoringContract.findFirst({
      where: { id: contractId, teacherId },
    });
    if (!contract) throw new NotFoundException("Contract not found");

    const log = await prisma.attendanceLog.findFirst({
      where: { contractId, checkOutTime: null },
      orderBy: { checkInTime: "desc" },
    });
    if (!log) throw new NotFoundException("Active check-in not found");

    await prisma.attendanceLog.update({
      where: { id: log.id },
      data: {
        checkOutTime: new Date(),
        isVerifiedGeofence: true,
      },
    });

    return { success: true };
  }

  async getContractAttendance(contractId: string) {
    return prisma.attendanceLog.findMany({
      where: { contractId },
      orderBy: { checkInTime: "desc" },
    });
  }
}