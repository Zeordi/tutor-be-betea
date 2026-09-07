import { Controller, Post, Get, Param, Body, UseGuards } from "@nestjs/common";
import { ProgressService } from "./progress.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("progress")
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post(":contractId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  submitProgress(@CurrentUser() user: any, @Param("contractId") contractId: string, @Body() body: any) {
    return this.progressService.submitProgress(contractId, body);
  }

  @Get(":contractId")
  getProgress(@Param("contractId") contractId: string) {
    return this.progressService.getProgress(contractId);
  }
}