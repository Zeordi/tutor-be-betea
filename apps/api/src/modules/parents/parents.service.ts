import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class ParentsService {
  async addChild(
    parentId: string,
    data: {
      studentName: string;
      gradeLevel: string;
      curriculum?: string;
      subjects?: string[];
      specialLearningNotes?: string;
    },
  ) {
    return prisma.studentProfile.create({
      data: {
        parentId,
        studentName: data.studentName,
        gradeLevel: data.gradeLevel,
        curriculum: (data.curriculum as any) || "NATIONAL_MINISTRY",
        subjects: data.subjects || [],
        specialLearningNotes: data.specialLearningNotes,
      },
    });
  }

  async getMyChildren(parentId: string) {
    return prisma.studentProfile.findMany({
      where: { parentId },
      orderBy: { createdAt: "desc" },
      include: {
        contracts: {
          select: { id: true, status: true, teacherId: true },
        },
      },
    });
  }

  async getChild(parentId: string, childId: string) {
    const child = await prisma.studentProfile.findFirst({
      where: { id: childId, parentId },
      include: {
        contracts: {
          include: {
            teacher: {
              select: { id: true, fullName: true, avatarUrl: true },
            },
          },
        },
        jobs: true,
      },
    });
    if (!child) throw new NotFoundException("Child not found");
    return child;
  }
}