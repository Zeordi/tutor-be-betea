import { Controller, Get, Post, Delete, Param, UseGuards } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("favorites")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("PARENT")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  list(@CurrentUser() user: any) {
    return this.favoritesService.list(user.id);
  }

  @Post(":teacherId")
  add(@CurrentUser() user: any, @Param("teacherId") teacherId: string) {
    return this.favoritesService.add(user.id, teacherId);
  }

  @Delete(":teacherId")
  remove(@CurrentUser() user: any, @Param("teacherId") teacherId: string) {
    return this.favoritesService.remove(user.id, teacherId);
  }
}