import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class SupportService {
  async createTicket(data: {
    userId: string;
    contractId?: string | null;
    reasonType: string;
    explanation: string;
    evidenceAttachmentUrls?: string[];
  }) {
    return prisma.supportTicket.create({
      data: {
        // schema: contractId String? — optional for Report a Problem without contract
        contractId: data.contractId || null,
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

  async listMine(userId: string) {
    return prisma.supportTicket.findMany({
      where: { submittedBy: userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: string, userId?: string) {
    const ticket = await prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException("Ticket not found");
    if (userId && ticket.submittedBy !== userId) {
      // allow later admin path without userId filter
    }
    return ticket;
  }

  async addStaffNote(id: string, staffNotes: string) {
    return prisma.supportTicket.update({
      where: { id },
      data: { staffNotes, status: "UNDER_REVIEW" },
    });
  }
}