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

type MatchResult = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  subCity: string | null;
  bio: string | null;
  subjects: string[];
  grades: string[];
  hourlyRate: number;
  monthlyRate: number;
  rating: number;
  totalReviews: number;
  badgeTier: string | null;
  isIdVerified: boolean;
  isEduVerified: boolean;
  latitude?: number;
  longitude?: number;
  distanceMeters: number | null;
  distanceText: string;
};

@Injectable()
export class MatchingService {
  async findTutors(params: MatchParams): Promise<MatchResult[]> {
    const maxM = Math.round((params.maxDistanceKm ?? 15) * 1000);
    const limit = params.limit ?? 50;
    const verified = params.verifiedOnly !== false;

    try {
      const rows = (await prisma.$queryRaw`
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
      `) as Array<Record<string, unknown>>;

      let results: MatchResult[] = rows.map((t: Record<string, unknown>) => ({
        id: String(t.user_id),
        fullName: String(t.full_name),
        avatarUrl: (t.avatar_url as string) ?? null,
        subCity: (t.sub_city as string) ?? null,
        bio: (t.bio as string) ?? null,
        subjects: (t.subjects as string[]) || [],
        grades: (t.grades as string[]) || [],
        hourlyRate: Number(t.hourly_rate),
        monthlyRate: Number(t.monthly_rate),
        rating: Number(t.rating),
        totalReviews: Number(t.total_reviews),
        badgeTier: (t.badge_tier as string) ?? null,
        isIdVerified: Boolean(t.is_id_verified),
        isEduVerified: Boolean(t.is_edu_verified),
        latitude: Number(t.latitude),
        longitude: Number(t.longitude),
        distanceMeters: Math.round(Number(t.distance_meters)),
        distanceText: `${(Number(t.distance_meters) / 1000).toFixed(1)} km`,
      }));

      if (params.subjects?.length) {
        const set = new Set(params.subjects.map((s: string) => s.toLowerCase()));
        results = results.filter((t: MatchResult) =>
          t.subjects.some((s: string) => set.has(String(s).toLowerCase())),
        );
      }
      if (params.grades?.length) {
        const set = new Set(params.grades.map((g: string) => g.toLowerCase()));
        results = results.filter((t: MatchResult) =>
          t.grades.some((g: string) => set.has(String(g).toLowerCase())),
        );
      }
      if (params.maxHourlyRate != null) {
        results = results.filter(
          (t: MatchResult) => t.hourlyRate <= Number(params.maxHourlyRate),
        );
      }

      return results;
    } catch {
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

      return profiles.map(
        (p: {
          userId: string;
          bio: string | null;
          subjects: string[];
          grades: string[];
          hourlyRate: unknown;
          monthlyRate: unknown;
          rating: unknown;
          totalReviews: number;
          badgeTier: string | null;
          isIdVerified: boolean;
          isEduVerified: boolean;
          user: {
            fullName: string;
            avatarUrl: string | null;
            subCity: string | null;
          };
        }) => ({
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
          distanceMeters: null,
          distanceText: "—",
        }),
      );
    }
  }
}