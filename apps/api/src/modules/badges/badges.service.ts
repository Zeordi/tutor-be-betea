import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class BadgesService {
  async issueBadge(params: {
    teacherId: string;
    badgeType: string;
    issuedBy?: string;
  }) {
    const existing = await prisma.trustBadge.findFirst({
      where: {
        teacherId: params.teacherId,
        badgeType: params.badgeType,
      },
    });

    if (existing) return existing;

    return prisma.trustBadge.create({
      data: {
        teacherId: params.teacherId,
        badgeType: params.badgeType,
      },
    });
  }

  async getTeacherBadges(teacherId: string) {
    return prisma.trustBadge.findMany({
      where: { teacherId },
      orderBy: { issuedAt: "desc" },
    });
  }
}
