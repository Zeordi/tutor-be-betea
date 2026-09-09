import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { BlogService } from "./blog.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("blog")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  listPublished() {
    return this.blogService.listPublished();
  }

  @Get("admin/all")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  adminList() {
    return this.blogService.adminList();
  }

  @Post("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  adminUpsert(@Body() body: any) {
    return this.blogService.adminUpsert(body);
  }

  @Get(":slug")
  getBySlug(@Param("slug") slug: string) {
    return this.blogService.getBySlug(slug);
  }
}