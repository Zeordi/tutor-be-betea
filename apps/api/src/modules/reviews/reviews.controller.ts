import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get("teacher/:teacherId")
  list(@Param("teacherId") teacherId: string) {
    return this.reviewsService.listForTeacher(teacherId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.reviewsService.create(user.id, body);
  }
}