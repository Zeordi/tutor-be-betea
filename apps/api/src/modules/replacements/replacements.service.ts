import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class ReplacementsService {
  async create(parentId: string, contractId: string, reason: string) {
    const contract = await prisma.tutoringContract.findUnique({
      where: { id: contractId },
    });
    if (!contract) throw new NotFoundException("Contract not found");
    if (contract.parentId !== parentId) throw new ForbiddenException();

    return prisma.replacementRequest.create({
      data: { contractId, reason, status: "OPEN" },
    });
  }

  async listForParent(parentId: string) {
    return prisma.replacementRequest.findMany({
      where: { contract: { parentId } },
      orderBy: { createdAt: "desc" },
      include: { contract: true },
    });
  }
}