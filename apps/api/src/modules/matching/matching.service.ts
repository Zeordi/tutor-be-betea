import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { getDistanceMeters } from "@tutor/geo";

@Injectable()
export class MatchingService {
  async findTutors(params: {
    latitude: number;
    longitude: number;
    subjects?: string[];
    grades?: string[];
    maxDistanceKm?: number;
    limit?: number;
  }) {
    const maxDistance = (params.maxDistanceKm || 10) * 1000; // meters
    const limit = params.limit || 20;

    // Get all available verified teachers
    const teachers = await prisma.teacherProfile.findMany({
      where: {
        isAvailable: true,
        isIdVerified: true,
        user: {
          status: "ACTIVE",
        },
        ...(params.subjects && {
          subjects: { hasSome: params.subjects },
        }),
        ...(params.grades && {
          grades: { hasSome: params.grades },
        }),
      },
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

    // Calculate distance and filter
    const withDistance = teachers
      .map((t) => {
        // In production we will use PostGIS ST_Distance
        // For now we simulate with a placeholder location (replace later)
        const distance = Math.random() * 8000; // temporary mock

        return {
          ...t,
          distanceMeters: Math.round(distance),
        };
      })
      .filter((t) => t.distanceMeters <= maxDistance)
      .sort((a, b) => {
        // Ranking: Badge tier → Distance → Rating
        const badgeScore = { GOLD_ELITE: 3, SILVER: 2, BRONZE: 1 };
        const scoreA = (badgeScore[a.badgeTier as keyof typeof badgeScore] || 0) * 1000 - a.distanceMeters + Number(a.rating) * 10;
        const scoreB = (badgeScore[b.badgeTier as keyof typeof badgeScore] || 0) * 1000 - b.distanceMeters + Number(b.rating) * 10;
        return scoreB - scoreA;
      })
      .slice(0, limit);

    return withDistance.map((t) => ({
      id: t.userId,
      fullName: t.user.fullName,
      avatarUrl: t.user.avatarUrl,
      subjects: t.subjects,
      grades: t.grades,
      hourlyRate: t.hourlyRate,
      monthlyRate: t.monthlyRate,
      rating: t.rating,
      totalReviews: t.totalReviews,
      badgeTier: t.badgeTier,
      isIdVerified: t.isIdVerified,
      isEduVerified: t.isEduVerified,
      distanceMeters: t.distanceMeters,
      distanceText: `${(t.distanceMeters / 1000).toFixed(1)} km`,
    }));
  }
}
