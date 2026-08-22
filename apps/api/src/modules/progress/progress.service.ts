import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class ProgressService {
  async submitReport(params: {
    contractId: string;
    teacherId: string;
    weekNumber: number;
    topicsCovered: string;
    quizScore?: number;
    strengthsNotes?: string;
    improvementAreas?: string;
  }) {
    // Simple AI-style summary generator (can be replaced with real AI later)
    const aiSummary = this.generateAiSummary(params);

    return prisma.progressReport.create({
      data: {
        contractId: params.contractId,
        weekNumber: params.weekNumber,
        topicsCovered: params.topicsCovered,
        quizScore: params.quizScore,
        strengthsNotes: params.strengthsNotes,
        improvementAreas: params.improvementAreas,
      },
    });
  }

  private generateAiSummary(data: {
    topicsCovered: string;
    quizScore?: number;
    strengthsNotes?: string;
    improvementAreas?: string;
  }): string {
    const scoreText = data.quizScore
      ? `Achieved an average quiz score of ${data.quizScore}%.`
      : "";

    return `This week the student covered: ${data.topicsCovered}. ${scoreText} ${
      data.strengthsNotes ? `Strengths: ${data.strengthsNotes}.` : ""
    } ${data.improvementAreas ? `Focus areas: ${data.improvementAreas}.` : ""}`;
  }

  async getReportsByContract(contractId: string) {
    return prisma.progressReport.findMany({
      where: { contractId },
      orderBy: { weekNumber: "desc" },
    });
  }

  async getReportById(id: string) {
    const report = await prisma.progressReport.findUnique({
      where: { id },
    });
    if (!report) throw new NotFoundException("Progress report not found");
    return report;
  }
}
