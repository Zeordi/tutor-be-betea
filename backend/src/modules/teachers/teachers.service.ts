import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async create(userId: string, dto: CreateTeacherProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.prisma.teacherProfile.findUnique({ where: { userId } });
    if (existing) throw new BadRequestException('Teacher profile already exists');

    return this.prisma.teacherProfile.create({
      data: {
        userId,
        bio: dto.bio,
        subjects: dto.subjects,
        hourlyRate: dto.hourlyRate,
        experienceYears: dto.experienceYears ?? 0,
        verificationStatus: VerificationStatus.PENDING,
      },
      include: {
        user: {
          select: { fullName: true, profileImage: true, phone: true },
        },
      },
    });
  }

  async update(userId: string, dto: UpdateTeacherProfileDto) {
    const profile = await this.prisma.teacherProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Teacher profile not found');
    return this.updateById(profile.id, dto);
  }

  async updateById(id: string, dto: UpdateTeacherProfileDto) {
    const profile = await this.prisma.teacherProfile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Teacher profile not found');

    return this.prisma.teacherProfile.update({
      where: { id },
      data: {
        ...(dto.bio != null ? { bio: dto.bio } : {}),
        ...(dto.subjects != null ? { subjects: dto.subjects } : {}),
        ...(dto.languages != null ? { languages: dto.languages } : {}),
        ...(dto.hourlyRate != null ? { hourlyRate: dto.hourlyRate } : {}),
        ...(dto.experienceYears != null ? { experienceYears: dto.experienceYears } : {}),
        ...(dto.education != null ? { education: dto.education as object } : {}),
        ...(dto.serviceRadiusKm != null ? { serviceRadiusKm: dto.serviceRadiusKm } : {}),
        ...(dto.isAvailable != null ? { isAvailable: dto.isAvailable } : {}),
        ...(dto.introVideoUrl != null ? { introVideoUrl: dto.introVideoUrl } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            profileImage: true,
          },
        },
      },
    });
  }
}
