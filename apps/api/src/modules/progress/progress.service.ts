import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { prisma } from "@tutor/database";

type ChildProgress = {
  childId: string;
  studentName: string;
  gradeLevel: string;
  overallScore: number;
  sessionsThisMonth: number;
  attendancePct: number;
  homeworkPct: number;
  subjects: { name: string; score: number }[];
  aiInsights: string[];
};

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

  /** Multi-child / parent hub: aggregated progress per child for dashboard */
  async listForParent(parentId: string): Promise<ChildProgress[]> {
    try {
      const contracts = await prisma.tutoringContract.findMany({
        where: { parentId },
        select: {
          id: true,
          studentId: true,
          student: {
            select: { id: true, studentName: true, gradeLevel: true },
          },
        },
      });

      if (contracts.length === 0) return [];

      const contractIds = contracts.map((c) => c.id);

      const reports = await prisma.progressReport.findMany({
        where: { contractId: { in: contractIds } },
        orderBy: [{ contractId: "asc" }, { weekNumber: "desc" }],
        select: {
          contractId: true,
          topicsCovered: true,
          quizScore: true,
          aiSummary: true,
        },
      });

      const reportsByContract = new Map<string, typeof reports>();
      for (const report of reports) {
        const existing = reportsByContract.get(report.contractId);
        if (!existing) reportsByContract.set(report.contractId, []);
        reportsByContract.get(report.contractId)!.push(report);
      }

      const childMap = new Map<string, (typeof contracts)[0]>();
      for (const contract of contracts) {
        childMap.set(contract.studentId, contract);
      }

      const result: ChildProgress[] = [];

      for (const contract of contracts) {
        const childReports = reportsByContract.get(contract.id) || [];
        const scores = childReports
          .map((r) => (r.quizScore != null ? Number(r.quizScore) : null))
          .filter((s): s is number => s != null);
        const overallScore =
          scores.length > 0
            ? Math.round(
                scores.reduce((sum, s) => sum + Number(s), 0) / scores.length,
              )
            : 0;

        const topicSet = new Set<string>();
        for (const r of childReports) {
          const parts = r.topicsCovered
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
          for (const p of parts) topicSet.add(p);
        }

        const subjects = Array.from(topicSet).map((name) => ({
          name,
          score: overallScore,
        }));

        const insights: string[] = [];
        for (const r of childReports) {
          if (r.aiSummary) {
            const parts = r.aiSummary
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean);
            insights.push(...parts);
          }
        }

        result.push({
          childId: contract.student.id,
          studentName: contract.student.studentName,
          gradeLevel: contract.student.gradeLevel,
          overallScore,
          sessionsThisMonth: childReports.length,
          attendancePct: 0,
          homeworkPct: 0,
          subjects,
          aiInsights: insights,
        });
      }

      return result;
    } catch (err) {
      console.error("listForParent failed", err);
      return [];
    }
  }
}