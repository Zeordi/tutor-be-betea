import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { ParentsService } from "./parents.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("parents")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("PARENT")
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post("children")
  addChild(@CurrentUser() user: any, @Body() body: any) {
    return this.parentsService.addChild(user.id, body);
  }

  @Get("children")
  getMyChildren(@CurrentUser() user: any) {
    return this.parentsService.getMyChildren(user.id);
  }

  @Get("children/:id")
  getChild(@CurrentUser() user: any, @Param("id") id: string) {
    return this.parentsService.getChild(user.id, id);
  }
}
