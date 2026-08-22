import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class JobsService {
  async create(parentId: string, data: {
    studentId: string;
    subjects: string[];
    monthlyBudget: number;
    isUrgentBoost?: boolean;
  }) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    return prisma.parentJob.create({
      data: {
        parentId,
        studentId: data.studentId,
        subjects: data.subjects,
        monthlyBudget: data.monthlyBudget,
        isUrgentBoost: data.isUrgentBoost || false,
        status: "OPEN",
        expiresAt,
      },
    });
  }

  async getOpenJobs() {
    return prisma.parentJob.findMany({
      where: {
        status: "OPEN",
        expiresAt: { gt: new Date() },
      },
      orderBy: [{ isUrgentBoost: "desc" }, { createdAt: "desc" }],
    });
  }

  async getMyJobs(parentId: string) {
    return prisma.parentJob.findMany({
      where: { parentId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getJobById(id: string) {
    const job = await prisma.parentJob.findUnique({ where: { id } });
    if (!job) throw new NotFoundException("Job not found");
    return job;
  }
}
