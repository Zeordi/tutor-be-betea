import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(parentId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { parentId },
      orderBy: { createdAt: 'desc' },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                fullName: true,
                profileImage: true,
              },
            },
            availability: true,
          },
        },
      },
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return favorites.map((fav) => ({
      id: fav.id,
      teacherId: fav.teacherId,
      createdAt: fav.createdAt,
      teacher: {
        id: fav.teacher.id,
        name: fav.teacher.user.fullName,
        subject:
          Array.isArray(fav.teacher.subjects) && fav.teacher.subjects[0]
            ? String(fav.teacher.subjects[0])
            : 'General',
        subjects: Array.isArray(fav.teacher.subjects)
          ? fav.teacher.subjects.map(String)
          : [],
        rating: Number(fav.teacher.avgRating),
        reviews: fav.teacher.totalReviews,
        price: Number(fav.teacher.hourlyRate),
        image: fav.teacher.user.profileImage || '',
        verified: fav.teacher.verificationStatus === VerificationStatus.APPROVED,
        experience: fav.teacher.experienceYears,
        availability: fav.teacher.availability.map(
          (a) => dayNames[a.dayOfWeek] || String(a.dayOfWeek),
        ),
        isAvailable: fav.teacher.isAvailable,
      },
    }));
  }

  async add(parentId: string, teacherId: string) {
    const teacher = await this.prisma.teacherProfile.findUnique({
      where: { id: teacherId },
    });
    if (!teacher) throw new NotFoundException('Teacher not found');

    try {
      const favorite = await this.prisma.favorite.create({
        data: { parentId, teacherId },
      });
      return { id: favorite.id, teacherId: favorite.teacherId, createdAt: favorite.createdAt };
    } catch {
      throw new ConflictException('Teacher is already in favorites');
    }
  }

  async remove(parentId: string, teacherId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        parentId_teacherId: { parentId, teacherId },
      },
    });
    if (!existing) throw new NotFoundException('Favorite not found');

    await this.prisma.favorite.delete({
      where: { id: existing.id },
    });
    return { success: true, teacherId };
  }

  async teacherIds(parentId: string): Promise<string[]> {
    const rows = await this.prisma.favorite.findMany({
      where: { parentId },
      select: { teacherId: true },
    });
    return rows.map((r) => r.teacherId);
  }
}
