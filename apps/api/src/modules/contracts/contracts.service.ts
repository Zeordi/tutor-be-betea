import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class ContractsService {
  async createContract(parentId: string, data: any) {
    const job = await prisma.parentJob.findUnique({ where: { id: data.jobId } });
    if (!job) throw new NotFoundException("Job not found");

    return prisma.tutoringContract.create({
      data: {
        parentId,
        teacherId: data.teacherId,
        studentId: job.studentId,
        agreedAmount: data.agreedAmount,
        platformFeePercent: 10,
        escrowHeldAmount: data.agreedAmount,
        status: "PENDING_ESCROW",
        guaranteeExpiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
      include: { teacher: true, parent: true },
    });
  }

  async getContract(id: string) {
    const contract = await prisma.tutoringContract.findUnique({
      where: { id },
      include: {
        teacher: true,
        parent: true,
        student: true,
        attendanceLogs: true,
        progressReports: true,
      },
    });
    if (!contract) throw new NotFoundException("Contract not found");
    return contract;
  }

  async releaseEscrow(contractId: string, adminId: string) {
    const contract = await prisma.tutoringContract.findUnique({
      where: { id: contractId },
    });
    if (!contract) throw new NotFoundException("Contract not found");

    await prisma.tutoringContract.update({
      where: { id: contractId },
      data: { status: "COMPLETED" },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId,
        targetUserId: contract.teacherId,
        actionType: "RELEASE_ESCROW",
        reason: "Contract completed",
      },
    });

    return { success: true };
  }
}