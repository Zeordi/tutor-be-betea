import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class ProgressService {
  async submitProgress(contractId: string, teacherId: string, data: any) {
    const contract = await prisma.tutoringContract.findFirst({
      where: { id: contractId, teacherId },
    });
    if (!contract) throw new NotFoundException("Contract not found");

    return prisma.progressReport.create({
      data: {
        contractId,
        weekNumber: data.weekNumber,
        topicsCovered: data.topicsCovered,
        quizScore: data.quizScore,
        strengthsNotes: data.strengthsNotes,
        improvementAreas: data.improvementAreas,
        aiSummary: data.aiSummary,
        nextSessionPlan: data.nextSessionPlan,
      },
    });
  }

  async getProgress(contractId: string) {
    return prisma.progressReport.findMany({
      where: { contractId },
      orderBy: { weekNumber: "desc" },
    });
  }

  /** Multi-child / parent hub: all reports for contracts owned by parent */
  async listForParent(parentId: string) {
    return prisma.progressReport.findMany({
      where: { contract: { parentId } },
      orderBy: [{ contractId: "asc" }, { weekNumber: "desc" }],
      include: {
        contract: {
          select: {
            id: true,
            studentId: true,
            teacherId: true,
            status: true,
            student: {
              select: { id: true, studentName: true, gradeLevel: true },
            },
          },
        },
      },
    });
  }
}