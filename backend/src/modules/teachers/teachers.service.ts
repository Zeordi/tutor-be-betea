import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeacherProfileDto } from './dto/create-teacher-profile.dto';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async search(params: {
    subject?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    radius?: number;
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      isAvailable: true,
      verificationStatus: VerificationStatus.APPROVED,
    };

    if (params.minPrice != null || params.maxPrice != null) {
      where.hourlyRate = {
        ...(params.minPrice != null ? { gte: params.minPrice } : {}),
        ...(params.maxPrice != null ? { lte: params.maxPrice } : {}),
      };
    }

    if (params.rating != null) {
      where.avgRating = { gte: params.rating };
    }

    const [teachers, total] = await Promise.all([
      this.prisma.teacherProfile.findMany({
        where,
        include: {
          user: true,
          availability: true,
        },
        skip,
        take: limit,
        orderBy: { avgRating: 'desc' },
      }),
      this.prisma.teacherProfile.count({ where }),
    ]);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = teachers
      .filter((t) => {
        if (!params.subject) return true;
        const subjects = Array.isArray(t.subjects) ? t.subjects : [];
        return subjects.some((s) => String(s).toLowerCase().includes(params.subject!.toLowerCase()));
      })
      .map((t) => ({
        id: t.id,
        name: t.user.fullName,
        subject: Array.isArray(t.subjects) && t.subjects[0] ? String(t.subjects[0]) : 'General',
        rating: Number(t.avgRating),
        reviews: t.totalReviews,
        price: Number(t.hourlyRate),
        distance: `${params.radius ?? 10} km`,
        image: t.user.profileImage || '',
        verified: t.verificationStatus === VerificationStatus.APPROVED,
        experience: t.experienceYears,
        availability: t.availability.map((a) => dayNames[a.dayOfWeek] || String(a.dayOfWeek)),
      }));

    return {
      data,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findAll(q?: string) {
    const teachers = await this.prisma.teacherProfile.findMany({
      include: { user: true },
      take: 50,
    });
    if (!q) return teachers;
    const needle = q.toLowerCase();
    return teachers.filter(
      (t) =>
        t.user.fullName.toLowerCase().includes(needle) ||
        t.bio?.toLowerCase().includes(needle) ||
        (Array.isArray(t.subjects) &&
          t.subjects.some((s) => String(s).toLowerCase().includes(needle))),
    );
  }

  async findOne(id: string) {
    return this.prisma.teacherProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            fullName: true,
            profileImage: true,
            phone: true,
          },
        },
        availability: true,
      },
    });
  }

  async create(dto: CreateTeacherProfileDto) {
    return {
      id: crypto.randomUUID(),
      ...dto,
    };
  }

  async update(dto: UpdateTeacherProfileDto) {
    if (!dto.id) return null;
    return this.prisma.teacherProfile.update({
      where: { id: dto.id },
      data: {
        ...(dto.bio != null ? { bio: dto.bio } : {}),
        ...(dto.subjects != null ? { subjects: dto.subjects } : {}),
        ...(dto.hourlyRate != null ? { hourlyRate: dto.hourlyRate } : {}),
      },
    });
  }
}
