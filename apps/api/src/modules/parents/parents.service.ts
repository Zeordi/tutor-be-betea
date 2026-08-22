import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class ParentsService {
  async addChild(parentId: string, data: {
    studentName: string;
    gradeLevel: string;
    curriculum?: string;
  }) {
    return prisma.studentProfile.create({
      data: {
        parentId,
        studentName: data.studentName,
        gradeLevel: data.gradeLevel,
        curriculum: (data.curriculum as any) || "NATIONAL_MINISTRY",
      },
    });
  }

  async getMyChildren(parentId: string) {
    return prisma.studentProfile.findMany({
      where: { parentId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getChild(parentId: string, childId: string) {
    const child = await prisma.studentProfile.findFirst({
      where: { id: childId, parentId },
    });
    if (!child) throw new NotFoundException("Child not found");
    return child;
  }
}
