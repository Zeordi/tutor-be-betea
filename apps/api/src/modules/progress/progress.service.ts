import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class ProgressService {
  async submitProgress(contractId: string, data: any) {
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
}