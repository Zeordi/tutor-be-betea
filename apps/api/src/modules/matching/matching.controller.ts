import { Controller, Get, Query } from "@nestjs/common";
import { MatchingService } from "./matching.service";

@Controller("matching")
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get("tutors")
  findTutors(
    @Query("lat") lat?: string,
    @Query("lng") lng?: string,
    @Query("subjects") subjects?: string,
    @Query("grades") grades?: string,
    @Query("maxDistanceKm") maxDistanceKm?: string,
    @Query("verifiedOnly") verifiedOnly?: string,
    @Query("maxHourlyRate") maxHourlyRate?: string,
    @Query("limit") limit?: string,
  ) {
    const latitude = lat != null ? parseFloat(lat) : 9.03;
    const longitude = lng != null ? parseFloat(lng) : 38.74;

    return this.matchingService.findTutors({
      latitude,
      longitude,
      subjects: subjects
        ? subjects
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      grades: grades
        ? grades
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean)
        : undefined,
      maxDistanceKm: maxDistanceKm ? parseFloat(maxDistanceKm) : 15,
      verifiedOnly:
        verifiedOnly === undefined
          ? true
          : verifiedOnly === "true" || verifiedOnly === "1",
      maxHourlyRate: maxHourlyRate ? parseFloat(maxHourlyRate) : undefined,
      limit: limit ? parseInt(limit, 10) : 50,
    });
  }
}