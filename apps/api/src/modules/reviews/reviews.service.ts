import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class ReviewsService {
  async listForTeacher(teacherId: string) {
    return prisma.review.findMany({
      where: { teacherId },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });
  }

  async create(
    authorId: string,
    data: { teacherId: string; contractId?: string; rating: number; comment?: string },
  ) {
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestException("Rating must be 1–5");
    }
    const teacher = await prisma.user.findFirst({
      where: { id: data.teacherId, role: "TEACHER" },
    });
    if (!teacher) throw new NotFoundException("Teacher not found");

    const review = await prisma.review.create({
      data: {
        authorId,
        teacherId: data.teacherId,
        contractId: data.contractId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    const agg = await prisma.review.aggregate({
      where: { teacherId: data.teacherId },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.teacherProfile.updateMany({
      where: { userId: data.teacherId },
      data: {
        rating: agg._avg.rating || 5,
        totalReviews: agg._count,
      },
    });

    return review;
  }
}