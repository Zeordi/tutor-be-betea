import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { prisma } from "@tutor/database";
import { createHmac } from "crypto";

@Injectable()
export class ContractsService {
  private async writeAudit(params: {
    adminId: string;
    targetUserId?: string;
    actionType: string;
    reason: string;
  }) {
    const last = await prisma.adminAuditLog.findFirst({
      orderBy: { createdAt: "desc" },
      select: { currentHash: true },
    });
    const previousHash = last?.currentHash || "GENESIS";
    const currentHash = createHmac(
      "sha256",
      process.env.AUDIT_CHAIN_SECRET || process.env.JWT_SECRET || "dev",
    )
      .update(
        JSON.stringify({
          ...params,
          previousHash,
          at: new Date().toISOString(),
        }),
      )
      .digest("hex");

    await prisma.adminAuditLog.create({
      data: {
        adminId: params.adminId,
        targetUserId: params.targetUserId,
        actionType: params.actionType,
        reason: params.reason,
        ipAddress: "127.0.0.1",
        previousHash,
        currentHash,
      },
    });
  }

  async createContract(parentId: string, data: any) {
    const job = await prisma.parentJob.findUnique({
      where: { id: data.jobId },
    });
    if (!job) throw new NotFoundException("Job not found");
    if (job.parentId !== parentId) {
      throw new BadRequestException("Job does not belong to this parent");
    }

    return prisma.tutoringContract.create({
      data: {
        parentId,
        teacherId: data.teacherId,
        studentId: job.studentId,
        jobId: job.id,
        agreedAmount: data.agreedAmount,
        platformFeePercent: 10,
        escrowHeldAmount: data.agreedAmount,
        status: "PENDING_ESCROW",
        guaranteeExpiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        sessionLatitude: data.sessionLatitude,
        sessionLongitude: data.sessionLongitude,
      },
      include: {
        teacher: true,
        parent: true,
        student: true,
      },
    });
  }

  async getContract(id: string) {
    const contract = await prisma.tutoringContract.findUnique({
      where: { id },
      include: {
        teacher: true,
        parent: true,
        student: true,
        attendance: { orderBy: { checkInTime: "desc" } },
        progress: { orderBy: { weekNumber: "desc" } },
      },
    });
    if (!contract) throw new NotFoundException("Contract not found");
    return contract;
  }

  async listForParent(parentId: string) {
    return prisma.tutoringContract.findMany({
      where: { parentId },
      orderBy: { createdAt: "desc" },
      include: {
        teacher: { select: { id: true, fullName: true, avatarUrl: true } },
        student: true,
      },
    });
  }

  async listForTeacher(teacherId: string) {
    return prisma.tutoringContract.findMany({
      where: { teacherId },
      orderBy: { createdAt: "desc" },
      include: {
        parent: { select: { id: true, fullName: true } },
        student: true,
      },
    });
  }

  async releaseEscrow(contractId: string, adminId: string) {
    const contract = await prisma.tutoringContract.findUnique({
      where: { id: contractId },
    });
    if (!contract) throw new NotFoundException("Contract not found");

    await prisma.tutoringContract.update({
      where: { id: contractId },
      data: { status: "COMPLETED", escrowHeldAmount: 0 },
    });

    await this.writeAudit({
      adminId,
      targetUserId: contract.teacherId,
      actionType: "RELEASE_ESCROW",
      reason: "Contract completed — escrow released",
    });

    return { success: true };
  }
}