import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { ReplacementsService } from "./replacements.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("replacements")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("PARENT")
export class ReplacementsController {
  constructor(private readonly replacementsService: ReplacementsService) {}

  @Get()
  list(@CurrentUser() user: any) {
    return this.replacementsService.listForParent(user.id);
  }

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() body: { contractId: string; reason: string },
  ) {
    return this.replacementsService.create(
      user.id,
      body.contractId,
      body.reason,
    );
  }
}