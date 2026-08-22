import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class TeachersService {
  async createProfile(userId: string, data: {
    bio?: string;
    hourlyRate: number;
    monthlyRate: number;
    subjects: string[];
    grades: string[];
    maxTravelKm?: number;
  }) {
    return prisma.teacherProfile.create({
      data: {
        userId,
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        monthlyRate: data.monthlyRate,
        subjects: data.subjects,
        grades: data.grades,
        maxTravelKm: data.maxTravelKm ?? 5,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  async updateProfile(userId: string, data: Partial<{
    bio: string;
    hourlyRate: number;
    monthlyRate: number;
    subjects: string[];
    grades: string[];
    maxTravelKm: number;
    isAvailable: boolean;
  }>) {
    return prisma.teacherProfile.update({
      where: { userId },
      data,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async updateLocation(userId: string, latitude: number, longitude: number) {
    // Use raw query because of PostGIS
    await prisma.$executeRaw`
      UPDATE teacher_profiles
      SET home_location = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
      WHERE user_id = ${userId}::uuid
    `;

    return { success: true, latitude, longitude };
  }

  async getPublicProfile(teacherId: string) {
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: teacherId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            status: true,
          },
        },
      },
    });

    if (!profile || profile.user.status !== "ACTIVE") {
      throw new NotFoundException("Teacher not found");
    }

    // Public profile never returns sensitive documents
    return {
      id: profile.userId,
      fullName: profile.user.fullName,
      avatarUrl: profile.user.avatarUrl,
      bio: profile.bio,
      hourlyRate: profile.hourlyRate,
      monthlyRate: profile.monthlyRate,
      subjects: profile.subjects,
      grades: profile.grades,
      rating: profile.rating,
      totalReviews: profile.totalReviews,
      totalHoursTaught: profile.totalHoursTaught,
      badgeTier: profile.badgeTier,
      isIdVerified: profile.isIdVerified,
      isEduVerified: profile.isEduVerified,
      isAvailable: profile.isAvailable,
      maxTravelKm: profile.maxTravelKm,
    };
  }

  async getMyProfile(userId: string) {
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException("Teacher profile not found");
    }

    return profile;
  }
}
