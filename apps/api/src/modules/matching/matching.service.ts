import { Injectable, BadRequestException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class MatchingService {
  async findTutors(params: {
    latitude: number;
    longitude: number;
    subjects?: string[];
    grades?: string[];
    maxDistanceKm?: number;
    verifiedOnly?: boolean;
    limit?: number;
  }) {
    if (
      Number.isNaN(params.latitude) ||
      Number.isNaN(params.longitude)
    ) {
      throw new BadRequestException("lat and lng are required numbers");
    }

    const maxDistanceMeters = (params.maxDistanceKm || 15) * 1000;
    const limit = params.limit || 50;
    const verifiedOnly = params.verifiedOnly !== false; // default true for safety ranking

    // Base spatial query
    const teachers: any[] = await prisma.$queryRaw`
      SELECT 
        tp.user_id,
        tp.bio,
        tp.hourly_rate,
        tp.monthly_rate,
        tp.subjects,
        tp.grades,
        tp.rating,
        tp.total_reviews,
        tp.badge_tier,
        tp.is_id_verified,
        tp.is_edu_verified,
        tp.is_available,
        tp.max_travel_km,
        u.full_name,
        u.avatar_url,
        ST_Y(tp.home_location::geometry) AS latitude,
        ST_X(tp.home_location::geometry) AS longitude,
        ST_Distance(
          tp.home_location,
          ST_SetSRID(ST_MakePoint(${params.longitude}, ${params.latitude}), 4326)::geography
        ) AS distance_meters
      FROM teacher_profiles tp
      JOIN users u ON u.id = tp.user_id
      WHERE 
        u.status IN ('ACTIVE', 'PENDING_VERIFICATION')
        AND tp.is_available = true
        AND tp.home_location IS NOT NULL
        AND (
          ${verifiedOnly} = false
          OR tp.is_id_verified = true
        )
        AND ST_DWithin(
          tp.home_location,
          ST_SetSRID(ST_MakePoint(${params.longitude}, ${params.latitude}), 4326)::geography,
          ${maxDistanceMeters}
        )
      ORDER BY 
        CASE tp.badge_tier
          WHEN 'GOLD_ELITE' THEN 1
          WHEN 'GOLD' THEN 2
          WHEN 'SILVER' THEN 3
          ELSE 4
        END,
        distance_meters ASC,
        tp.rating DESC
      LIMIT ${limit};
    `;

    let results = teachers.map((t) => ({
      id: t.user_id,
      fullName: t.full_name,
      avatarUrl: t.avatar_url,
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

    // Filter subjects / grades in app layer (simple & reliable with string[])
    if (params.subjects?.length) {
      const set = new Set(params.subjects.map((s) => s.toLowerCase()));
      results = results.filter((t) =>
        (t.subjects as string[]).some((s) => set.has(String(s).toLowerCase())),
      );
    }
    if (params.grades?.length) {
      const set = new Set(params.grades.map((g) => g.toLowerCase()));
      results = results.filter((t) =>
        (t.grades as string[]).some((g) => set.has(String(g).toLowerCase())),
      );
    }

    return results;
  }
}