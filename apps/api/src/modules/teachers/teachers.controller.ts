import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { TeachersService } from "./teachers.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("teachers")
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  /** Browse list (no geo) — public */
  @Get()
  list(
    @Query("subject") subject?: string,
    @Query("verifiedOnly") verifiedOnly?: string,
    @Query("limit") limit?: string,
  ) {
    return this.teachersService.listTeachers({
      subject,
      verifiedOnly: verifiedOnly === "true" || verifiedOnly === "1",
      limit: limit ? parseInt(limit, 10) : 40,
    });
  }

  /** Must be before :id so "me" is not captured as id */
  @Get("me/profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  getMyProfile(@CurrentUser() user: any) {
    return this.teachersService.getMyProfile(user.id);
  }

  @Post("me/location")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  setLocation(
    @CurrentUser() user: any,
    @Body() body: { latitude: number; longitude: number },
  ) {
    return this.teachersService.updateLocation(
      user.id,
      Number(body.latitude),
      Number(body.longitude),
    );
  }

  @Post("profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  createProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.teachersService.createProfile(user.id, body);
  }

  @Patch("profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  updateProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.teachersService.updateProfile(user.id, body);
  }

  @Get(":id")
  getPublicProfile(@Param("id") id: string) {
    return this.teachersService.getPublicProfile(id);
  }
}