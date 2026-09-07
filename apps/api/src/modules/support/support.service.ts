import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class SupportService {
  async createTicket(data: any) {
    return prisma.supportTicket.create({
      data: {
        contractId: data.contractId,
        submittedBy: data.userId,
        reasonType: data.reasonType,
        explanation: data.explanation,
        evidenceAttachmentUrls: data.evidenceAttachmentUrls || [],
        status: "OPEN",
      },
    });
  }

  async getTicketsByContract(contractId: string) {
    return prisma.supportTicket.findMany({
      where: { contractId },
      orderBy: { createdAt: "desc" },
    });
  }
}