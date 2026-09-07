import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class AttendanceService {
  async checkIn(contractId: string, teacherId: string, latitude: number, longitude: number) {
    const contract = await prisma.tutoringContract.findUnique({
      where: { id: contractId, teacherId },
    });
    if (!contract) throw new NotFoundException("Contract not found");

    const log = await prisma.attendanceLog.create({
      data: {
        contractId,
        teacherId,
        checkInTime: new Date(),
        checkOutTime: null,
        distanceMeters: 0, // will be calculated client-side or via PostGIS
        isVerifiedGeofence: true,
        parentConfirmed: false,
        offlineId: crypto.randomUUID(), // for offline sync
      },
    });

    // Update contract status if needed
    await prisma.tutoringContract.update({
      where: { id: contractId },
      data: { status: "ACTIVE" },
    });

    return log;
  }

  async checkOut(contractId: string, teacherId: string) {
    const log = await prisma.attendanceLog.findFirst({
      where: { contractId, teacherId, checkOutTime: null },
      orderBy: { checkInTime: "desc" },
    });
    if (!log) throw new NotFoundException("Active check-in not found");

    const distance = 0; // client calculates or PostGIS query

    await prisma.attendanceLog.update({
      where: { id: log.id },
      data: {
        checkOutTime: new Date(),
        distanceMeters: distance,
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