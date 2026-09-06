import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class TeachersService {
  async createProfile(
    userId: string,
    data: {
      bio?: string;
      hourlyRate: number;
      monthlyRate: number;
      subjects: string[];
      grades: string[];
      maxTravelKm?: number;
    },
  ) {
    const existing = await prisma.teacherProfile.findUnique({
      where: { userId },
    });
    if (existing) {
      throw new ConflictException("Teacher profile already exists");
    }

    return prisma.teacherProfile.create({
      data: {
        userId,
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        monthlyRate: data.monthlyRate,
        subjects: data.subjects ?? [],
        grades: data.grades ?? [],
        maxTravelKm: data.maxTravelKm ?? 5,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            phoneNumber: true,
            status: true,
          },
        },
      },
    });
  }

  async updateProfile(
    userId: string,
    data: Partial<{
      bio: string;
      hourlyRate: number;
      monthlyRate: number;
      subjects: string[];
      grades: string[];
      maxTravelKm: number;
      isAvailable: boolean;
    }>,
  ) {
    const existing = await prisma.teacherProfile.findUnique({
      where: { userId },
    });
    if (!existing) {
      throw new NotFoundException("Teacher profile not found");
    }

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
    const existing = await prisma.teacherProfile.findUnique({
      where: { userId },
    });
    if (!existing) {
      throw new NotFoundException("Teacher profile not found");
    }

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

    if (!profile) {
      throw new NotFoundException("Teacher not found");
    }

    // Allow ACTIVE; for local testing also allow PENDING_VERIFICATION
    if (
      profile.user.status !== "ACTIVE" &&
      profile.user.status !== "PENDING_VERIFICATION"
    ) {
      throw new NotFoundException("Teacher not found");
    }

    const badges = await prisma.trustBadge.findMany({
      where: { teacherId },
      orderBy: { issuedAt: "desc" },
    });

    return {
      id: profile.userId,
      fullName: profile.user.fullName,
      avatarUrl: profile.user.avatarUrl,
      bio: profile.bio,
      hourlyRate: Number(profile.hourlyRate),
      monthlyRate: Number(profile.monthlyRate),
      subjects: profile.subjects,
      grades: profile.grades,
      rating: Number(profile.rating),
      totalReviews: profile.totalReviews,
      totalHoursTaught: Number(profile.totalHoursTaught),
      badgeTier: profile.badgeTier,
      isIdVerified: profile.isIdVerified,
      isEduVerified: profile.isEduVerified,
      isAvailable: profile.isAvailable,
      maxTravelKm: Number(profile.maxTravelKm),
      trustBadges: badges.map((b) => ({
        type: b.badgeType,
        issuedAt: b.issuedAt,
      })),
    };
  }

  async getMyProfile(userId: string) {
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!profile) {
      throw new NotFoundException("Teacher profile not found");
    }

    const badges = await prisma.trustBadge.findMany({
      where: { teacherId: userId },
      orderBy: { issuedAt: "desc" },
    });

    return { ...profile, trustBadges: badges };
  }

  /** Non-geo list for admin / fallback browse */
  async listTeachers(params?: {
    subject?: string;
    verifiedOnly?: boolean;
    limit?: number;
  }) {
    const limit = params?.limit ?? 40;

    const profiles = await prisma.teacherProfile.findMany({
      where: {
        isAvailable: true,
        ...(params?.verifiedOnly ? { isIdVerified: true } : {}),
        ...(params?.subject
          ? { subjects: { has: params.subject } }
          : {}),
        user: {
          status: { in: ["ACTIVE", "PENDING_VERIFICATION"] },
        },
      },
      take: limit,
      orderBy: [{ rating: "desc" }, { totalReviews: "desc" }],
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

    return profiles.map((p) => ({
      id: p.userId,
      fullName: p.user.fullName,
      avatarUrl: p.user.avatarUrl,
      bio: p.bio,
      subjects: p.subjects,
      grades: p.grades,
      hourlyRate: Number(p.hourlyRate),
      monthlyRate: Number(p.monthlyRate),
      rating: Number(p.rating),
      totalReviews: p.totalReviews,
      badgeTier: p.badgeTier,
      isIdVerified: p.isIdVerified,
      isEduVerified: p.isEduVerified,
    }));
  }
}