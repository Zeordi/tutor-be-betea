import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class SupportService {
  async createTicket(data: {
    contractId: string;
    submittedBy: string;
    reasonType: string;
    explanation: string;
    evidenceAttachmentUrls?: string[];
  }) {
    return prisma.supportTicket.create({
      data: {
        contractId: data.contractId,
        submittedBy: data.submittedBy,
        reasonType: data.reasonType,
        explanation: data.explanation,
        evidenceAttachmentUrls: data.evidenceAttachmentUrls || [],
        status: "OPEN",
      },
    });
  }

  async getTickets(status?: string) {
    return prisma.supportTicket.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }
}
