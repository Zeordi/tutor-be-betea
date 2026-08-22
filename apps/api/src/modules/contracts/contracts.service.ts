import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { EscrowService } from "../escrow/escrow.service";

@Injectable()
export class ContractsService {
  constructor(private readonly escrowService: EscrowService) {}

  async create(data: {
    parentId: string;
    teacherId: string;
    studentId: string;
    agreedAmount: number;
    startDate: string;
    endDate: string;
  }) {
    const platformFeePercent = 10;
    const guaranteeExpiry = new Date();
    guaranteeExpiry.setDate(guaranteeExpiry.getDate() + 14); // 14-day guarantee

    const contract = await prisma.tutoringContract.create({
      data: {
        parentId: data.parentId,
        teacherId: data.teacherId,
        studentId: data.studentId,
        agreedAmount: data.agreedAmount,
        platformFeePercent,
        escrowHeldAmount: 0,
        status: "PENDING_ESCROW",
        guaranteeExpiry,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });

    return contract;
  }

  async fundEscrow(contractId: string, parentId: string) {
    const contract = await prisma.tutoringContract.findUnique({
      where: { id: contractId },
    });

    if (!contract) throw new NotFoundException("Contract not found");
    if (contract.parentId !== parentId) throw new BadRequestException("Not your contract");
    if (contract.status !== "PENDING_ESCROW") {
      throw new BadRequestException("Contract is not waiting for escrow");
    }

    // In real implementation: call payment gateway (Telebirr, CBE, Stripe...)
    // For now we simulate successful funding
    const updated = await prisma.tutoringContract.update({
      where: { id: contractId },
      data: {
        escrowHeldAmount: contract.agreedAmount,
        status: "ACTIVE",
      },
    });

    return updated;
  }

  async completeContract(contractId: string) {
    const contract = await prisma.tutoringContract.findUnique({
      where: { id: contractId },
    });

    if (!contract) throw new NotFoundException("Contract not found");

    // Release money to teacher minus platform fee
    await this.escrowService.releaseToTeacher(contract);

    return prisma.tutoringContract.update({
      where: { id: contractId },
      data: { status: "COMPLETED" },
    });
  }

  async getById(id: string) {
    const contract = await prisma.tutoringContract.findUnique({
      where: { id },
    });
    if (!contract) throw new NotFoundException("Contract not found");
    return contract;
  }

  async getMyContracts(userId: string, role: "PARENT" | "TEACHER") {
    const where = role === "PARENT" ? { parentId: userId } : { teacherId: userId };

    return prisma.tutoringContract.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }
}
