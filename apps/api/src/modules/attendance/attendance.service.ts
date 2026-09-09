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
    offlineId?: string,
  ) {
    const contract = await prisma.tutoringContract.findFirst({
      where: { id: contractId, teacherId },
    });
    if (!contract) throw new NotFoundException("Contract not found");

    if (offlineId) {
      const existing = await prisma.attendanceLog.findUnique({
        where: { offlineId },
      });
      if (existing) return existing;
    }

    const log = await prisma.attendanceLog.create({
      data: {
        contractId,
        teacherId,
        checkInTime: new Date(),
        distanceMeters: 0,
        isVerifiedGeofence: true,
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

    return prisma.attendanceLog.update({
      where: { id: log.id },
      data: { checkOutTime: new Date() },
    });
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