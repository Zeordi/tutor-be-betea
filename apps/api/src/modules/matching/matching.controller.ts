import { Controller, Get, Query } from "@nestjs/common";
import { MatchingService } from "./matching.service";

@Controller("matching")
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get("tutors")
  findTutors(
    @Query("lat") lat: string,
    @Query("lng") lng: string,
    @Query("subjects") subjects?: string,
    @Query("grades") grades?: string,
    @Query("maxDistanceKm") maxDistanceKm?: string,
  ) {
    return this.matchingService.findTutors({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      subjects: subjects ? subjects.split(",") : undefined,
      grades: grades ? grades.split(",") : undefined,
      maxDistanceKm: maxDistanceKm ? parseFloat(maxDistanceKm) : 10,
    });
  }
}
