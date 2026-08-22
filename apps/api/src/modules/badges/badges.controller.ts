import { Controller, Get, Param } from "@nestjs/common";
import { BadgesService } from "./badges.service";

@Controller("badges")
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get("teacher/:teacherId")
  getTeacherBadges(@Param("teacherId") teacherId: string) {
    return this.badgesService.getTeacherBadges(teacherId);
  }
}
