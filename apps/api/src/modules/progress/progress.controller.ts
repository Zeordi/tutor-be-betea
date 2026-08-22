import { Controller, Post, Get, Body, Param, UseGuards } from "@nestjs/common";
import { ProgressService } from "./progress.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("progress")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  @Roles("TEACHER")
  submit(@CurrentUser() user: any, @Body() body: any) {
    return this.progressService.submitReport({
      ...body,
      teacherId: user.id,
    });
  }

  @Get("contract/:contractId")
  @Roles("PARENT", "TEACHER", "SUPER_ADMIN")
  getByContract(@Param("contractId") contractId: string) {
    return this.progressService.getReportsByContract(contractId);
  }

  @Get(":id")
  @Roles("PARENT", "TEACHER", "SUPER_ADMIN")
  getOne(@Param("id") id: string) {
    return this.progressService.getReportById(id);
  }
}
