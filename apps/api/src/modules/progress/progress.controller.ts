import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ProgressService } from "./progress.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("progress")
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get("mine")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  listMine(@CurrentUser() user: any) {
    return this.progressService.listForParent(user.id);
  }

  @Post(":contractId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  submitProgress(
    @CurrentUser() user: any,
    @Param("contractId") contractId: string,
    @Body() body: any,
  ) {
    return this.progressService.submitProgress(contractId, user.id, body);
  }

  @Get(":contractId")
  @UseGuards(JwtAuthGuard)
  getProgress(@Param("contractId") contractId: string) {
    return this.progressService.getProgress(contractId);
  }
}