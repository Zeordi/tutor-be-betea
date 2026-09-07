import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class JobsService {
  async createJob(parentId: string, data: any) {
    const student = await prisma.studentProfile.findUnique({
      where: { id: data.studentId },
    });
    if (!student) throw new NotFoundException("Student not found");

    return prisma.parentJob.create({
      data: {
        parentId,
        studentId: data.studentId,
        subjects: data.subjects,
        monthlyBudget: data.monthlyBudget,
        status: "OPEN",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      include: {
        student: true,
        parent: { select: { id: true, fullName: true } },
      },
    });
  }

  async getJobById(id: string) {
    const job = await prisma.parentJob.findUnique({
      where: { id },
      include: {
        student: true,
        parent: true,
        applications: { include: { teacher: true } },
      },
    });
    if (!job) throw new NotFoundException("Job not found");
    return job;
  }

  async applyToJob(teacherId: string, jobId: string) {
    const job = await prisma.parentJob.findUnique({
      where: { id: jobId },
    });
    if (!job) throw new NotFoundException("Job not found");

    const application = await prisma.application.create({
      data: {
        teacherId,
        jobId,
        status: "PENDING",
        connectsCost: 2,
      },
      include: { teacher: true, job: true },
    });

    return application;
  }
}