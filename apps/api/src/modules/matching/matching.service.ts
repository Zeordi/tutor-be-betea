import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

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
    const maxDistanceMeters = (params.maxDistanceKm || 15) * 1000;
    const limit = params.limit || 50;

    // Spatial PostGIS query with extracted latitude & longitude for frontend map markers
    const teachers: any[] = await prisma.$queryRaw`
      SELECT 
        tp.*,
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
        u.status = 'ACTIVE'
        AND tp.is_id_verified = true
        AND tp.is_available = true
        AND tp.home_location IS NOT NULL
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
      distanceMeters: Math.round(t.distance_meters),
      distanceText: `${(t.distance_meters / 1000).toFixed(1)} km`,
    }));
  }
}