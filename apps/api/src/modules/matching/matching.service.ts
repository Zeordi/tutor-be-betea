import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

export type MatchParams = {
  latitude: number;
  longitude: number;
  subjects?: string[];
  grades?: string[];
  maxDistanceKm?: number;
  verifiedOnly?: boolean;
  limit?: number;
  maxHourlyRate?: number;
};

@Injectable()
export class MatchingService {
  /**
   * Spatial match via PostGIS + badge/rating ranking.
   * Falls back to non-geo list if PostGIS query fails (e.g. local without extension).
   */
  async findTutors(params: MatchParams) {
    const maxM = Math.round((params.maxDistanceKm ?? 15) * 1000);
    const limit = params.limit ?? 50;
    const verified = params.verifiedOnly !== false;

    try {
      const rows: any[] = await prisma.$queryRaw`
        SELECT
          tp.user_id,
          u.full_name,
          u.avatar_url,
          u.sub_city,
          tp.bio,
          tp.subjects,
          tp.grades,
          tp.hourly_rate,
          tp.monthly_rate,
          tp.rating,
          tp.total_reviews,
          tp.badge_tier,
          tp.is_id_verified,
          tp.is_edu_verified,
          ST_Y(tp.home_location::geometry) AS latitude,
          ST_X(tp.home_location::geometry) AS longitude,
          ST_Distance(
            tp.home_location,
            ST_SetSRID(ST_MakePoint(${params.longitude}, ${params.latitude}), 4326)::geography
          ) AS distance_meters
        FROM teacher_profiles tp
        JOIN users u ON u.id = tp.user_id
        WHERE tp.is_available = true
          AND tp.home_location IS NOT NULL
          AND u.status IN ('ACTIVE', 'PENDING_VERIFICATION')
          AND (
            ${verified} = false
            OR tp.is_id_verified = true
          )
          AND ST_DWithin(
            tp.home_location,
            ST_SetSRID(ST_MakePoint(${params.longitude}, ${params.latitude}), 4326)::geography,
            ${maxM}
          )
        ORDER BY
          CASE tp.badge_tier
            WHEN 'ELITE' THEN 0
            WHEN 'GOLD' THEN 1
            WHEN 'SILVER' THEN 2
            ELSE 3
          END,
          tp.is_edu_verified DESC,
          tp.rating DESC,
          distance_meters ASC
        LIMIT ${limit}
      `;

      let results = rows.map((t) => ({
        id: t.user_id,
        fullName: t.full_name,
        avatarUrl: t.avatar_url,
        subCity: t.sub_city,
        bio: t.bio,
        subjects: t.subjects || [],
        grades: t.grades || [],
        hourlyRate: Number(t.hourly_rate),
        monthlyRate: Number(t.monthly_rate),
        rating: Number(t.rating),
        totalReviews: t.total_reviews,
        badgeTier: t.badge_tier,
        isIdVerified: t.is_id_verified,
        isEduVerified: t.is_edu_verified,
        latitude: Number(t.latitude),
        longitude: Number(t.longitude),
        distanceMeters: Math.round(Number(t.distance_meters)),
        distanceText: `${(Number(t.distance_meters) / 1000).toFixed(1)} km`,
      }));

      if (params.subjects?.length) {
        const set = new Set(params.subjects.map((s) => s.toLowerCase()));
        results = results.filter((t) =>
          (t.subjects as string[]).some((s) =>
            set.has(String(s).toLowerCase()),
          ),
        );
      }
      if (params.grades?.length) {
        const set = new Set(params.grades.map((g) => g.toLowerCase()));
        results = results.filter((t) =>
          (t.grades as string[]).some((g) => set.has(String(g).toLowerCase())),
        );
      }
      if (params.maxHourlyRate != null) {
        results = results.filter(
          (t) => t.hourlyRate <= Number(params.maxHourlyRate),
        );
      }

      return results;
    } catch {
      // Fallback without PostGIS
      const profiles = await prisma.teacherProfile.findMany({
        where: {
          isAvailable: true,
          ...(verified ? { isIdVerified: true } : {}),
          user: { status: { in: ["ACTIVE", "PENDING_VERIFICATION"] } },
        },
        take: limit,
        orderBy: [{ rating: "desc" }, { totalReviews: "desc" }],
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              subCity: true,
            },
          },
        },
      });

      return profiles.map((p) => ({
        id: p.userId,
        fullName: p.user.fullName,
        avatarUrl: p.user.avatarUrl,
        subCity: p.user.subCity,
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
        distanceMeters: null as number | null,
        distanceText: "—",
      }));
    }
  }
}