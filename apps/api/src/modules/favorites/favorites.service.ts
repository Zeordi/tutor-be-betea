import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class FavoritesService {
  async list(parentId: string) {
    return prisma.favoriteTutor.findMany({
      where: { parentId },
      orderBy: { createdAt: "desc" },
      include: {
        teacher: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            teacherProfile: true,
          },
        },
      },
    });
  }

  async add(parentId: string, teacherId: string) {
    const teacher = await prisma.user.findFirst({
      where: { id: teacherId, role: "TEACHER" },
    });
    if (!teacher) throw new NotFoundException("Teacher not found");

    try {
      return await prisma.favoriteTutor.create({
        data: { parentId, teacherId },
        include: {
          teacher: { select: { id: true, fullName: true, avatarUrl: true } },
        },
      });
    } catch {
      throw new ConflictException("Already favorited");
    }
  }

  async remove(parentId: string, teacherId: string) {
    await prisma.favoriteTutor.deleteMany({
      where: { parentId, teacherId },
    });
    return { success: true };
  }
}