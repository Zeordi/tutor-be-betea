import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class JobsService {
  async createJob(parentId: string, data: any) {
    const child = await prisma.studentProfile.findFirst({
      where: { id: data.studentId, parentId },
    });
    if (!child) throw new NotFoundException("Child not found");

    return prisma.parentJob.create({
      data: {
        parentId,
        studentId: data.studentId,
        subjects: data.subjects || [],
        monthlyBudget: data.monthlyBudget,
        isUrgentBoost: !!data.isUrgentBoost,
        status: "OPEN",
        description: data.description,
        preferredGender: data.preferredGender,
        subCity: data.subCity,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      include: {
        student: true,
        parent: { select: { id: true, fullName: true } },
      },
    });
  }

  async listJobsForParent(parentId: string) {
    return prisma.parentJob.findMany({
      where: { parentId },
      orderBy: { createdAt: "desc" },
      include: {
        student: true,
        applications: {
          include: {
            teacher: { select: { id: true, fullName: true, avatarUrl: true } },
          },
        },
      },
    });
  }

  async listOpenJobs() {
    return prisma.parentJob.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      include: {
        student: {
          select: {
            id: true,
            studentName: true,
            gradeLevel: true,
            curriculum: true,
          },
        },
        parent: { select: { id: true, fullName: true, subCity: true } },
      },
    });
  }

  async getJobById(id: string) {
    const job = await prisma.parentJob.findUnique({
      where: { id },
      include: {
        student: true,
        parent: { select: { id: true, fullName: true, subCity: true } },
        applications: {
          include: {
            teacher: { select: { id: true, fullName: true, avatarUrl: true } },
          },
        },
      },
    });
    if (!job) throw new NotFoundException("Job not found");
    return job;
  }

  async applyToJob(teacherId: string, jobId: string, coverNote?: string) {
    const job = await prisma.parentJob.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException("Job not found");
    if (job.status !== "OPEN") {
      throw new BadRequestException("Job is not open for applications");
    }

    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: teacherId },
    });
    if (!profile) throw new NotFoundException("Teacher profile not found");

    const cost = 2;
    if (profile.connectsBalance < cost) {
      throw new BadRequestException("Insufficient Connects");
    }

    const application = await prisma.$transaction(async (tx) => {
      const app = await tx.jobApplication.create({
        data: {
          jobId,
          teacherId,
          coverNote,
          connectsSpent: cost,
          status: "PENDING",
        },
        include: {
          teacher: { select: { id: true, fullName: true } },
          job: true,
        },
      });
      await tx.teacherProfile.update({
        where: { userId: teacherId },
        data: { connectsBalance: { decrement: cost } },
      });
      await tx.connectTransaction.create({
        data: {
          teacherId,
          delta: -cost,
          reason: "APPLY_JOB",
          balanceAfter: profile.connectsBalance - cost,
        },
      });
      return app;
    });

    return application;
  }

  async listMyApplications(teacherId: string) {
    return prisma.jobApplication.findMany({
      where: { teacherId },
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          include: {
            student: true,
            parent: { select: { id: true, fullName: true } },
          },
        },
      },
    });
  }
}