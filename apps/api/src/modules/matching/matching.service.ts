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
    const maxDistanceMeters = (params.maxDistanceKm || 10) * 1000;
    const limit = params.limit || 20;

    // Real PostGIS query (requires home_location geography column)
    // We use raw query for full spatial power
    const teachers: any[] = await prisma.$queryRaw`
      SELECT 
        tp.*,
        u.full_name,
        u.avatar_url,
        ST_Distance(
          tp.home_location,
          ST_SetSRID(ST_MakePoint(${params.longitude}, ${params.latitude}), 4326)::geography
        ) AS distance_meters
      FROM teacher_profiles tp
      JOIN users u ON u.id = tp.user_id
      WHERE 
        u.status = 'ACTIVE'
        AND tp.is_id_verified = true
        AND tp.is_available = true
        AND ST_DWithin(
          tp.home_location,
          ST_SetSRID(ST_MakePoint(${params.longitude}, ${params.latitude}), 4326)::geography,
          ${maxDistanceMeters}
        )
      ORDER BY 
        CASE tp.badge_tier
          WHEN 'GOLD_ELITE' THEN 1
          WHEN 'SILVER' THEN 2
          ELSE 3
        END,
        distance_meters ASC,
        tp.rating DESC
      LIMIT ${limit};
    `;

    return teachers.map((t) => ({
      id: t.user_id,
      fullName: t.full_name,
      avatarUrl: t.avatar_url,
      subjects: t.subjects,
      grades: t.grades,
      hourlyRate: t.hourly_rate,
      monthlyRate: t.monthly_rate,
      rating: t.rating,
      totalReviews: t.total_reviews,
      badgeTier: t.badge_tier,
      isIdVerified: t.is_id_verified,
      isEduVerified: t.is_edu_verified,
      distanceMeters: Math.round(t.distance_meters),
      distanceText: `${(t.distance_meters / 1000).toFixed(1)} km`,
    }));
  }
}
