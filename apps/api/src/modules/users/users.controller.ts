import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Query,
  Param,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get current logged-in user
   */
  @Get("me")
  async getMe(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  /**
   * Update own profile
   */
  @Patch("me")
  async updateMe(
    @CurrentUser() user: any,
    @Body() body: { fullName?: string; email?: string; avatarUrl?: string },
  ) {
    return this.usersService.updateProfile(user.id, body);
  }

  /**
   * Admin only – list all users
   */
  @Get()
  @Roles("SUPER_ADMIN", "SUPPORT_AGENT")
  async findAll(
    @Query("role") role?: string,
    @Query("status") status?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.usersService.getAll({
      role: role as any,
      status: status as any,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  /**
   * Admin only – get single user
   */
  @Get(":id")
  @Roles("SUPER_ADMIN", "SUPPORT_AGENT")
  async findOne(@Param("id") id: string) {
    return this.usersService.findById(id);
  }
}
