import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("dashboard")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "SUPPORT_AGENT")
  getDashboardStats(@CurrentUser() user: any) {
    return this.adminService.getDashboardStats();
  }

  @Get("audit-logs")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "SUPPORT_AGENT")
  getAuditLogs(@Query("limit") limit = 100) {
    return this.adminService.getAuditLogs(parseInt(limit as any, 10));
  }

  @Get("verification-queue")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "VERIFICATION_OFFICER")
  getVerificationQueue() {
    return this.adminService.getVerificationQueue();
  }

  @Post("verification/:userId/approve")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "VERIFICATION_OFFICER")
  approveVerification(@CurrentUser() user: any, @Param("userId") userId: string) {
    return this.adminService.approveVerification(userId, user.id);
  }

  @Post("risk-flag/:userId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  flagRisk(@CurrentUser() user: any, @Param("userId") userId: string, @Body() body: any) {
    return this.adminService.flagRisk(userId, body.reason, user.id);
  }
}