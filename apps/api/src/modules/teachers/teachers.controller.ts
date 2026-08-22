import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
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

  /**
   * Public – Get teacher public profile (shows Trust Badges only)
   */
  @Get(":id")
  async getPublicProfile(@Param("id") id: string) {
    return this.teachersService.getPublicProfile(id);
  }

  /**
   * Teacher only – Create own profile
   */
  @Post("profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  async createProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.teachersService.createProfile(user.id, body);
  }

  /**
   * Teacher only – Update own profile
   */
  @Patch("profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  async updateProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.teachersService.updateProfile(user.id, body);
  }

  /**
   * Teacher only – Get my full profile
   */
  @Get("me/profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  async getMyProfile(@CurrentUser() user: any) {
    return this.teachersService.getMyProfile(user.id);
  }
}
