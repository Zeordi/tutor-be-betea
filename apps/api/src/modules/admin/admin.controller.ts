import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
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
  @Roles("SUPER_ADMIN", "SUPPORT_AGENT", "FINANCE", "VERIFICATION_OFFICER")
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get("audit-logs")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  getAuditLogs(@Query("limit") limit = "100") {
    return this.adminService.getAuditLogs(parseInt(limit as any, 10) || 100);
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
  approveVerification(
    @CurrentUser() user: any,
    @Param("userId") userId: string,
  ) {
    return this.adminService.approveVerification(userId, user.id);
  }

  @Post("risk-flag/:userId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  flagRisk(
    @CurrentUser() user: any,
    @Param("userId") userId: string,
    @Body() body: { reason?: string },
  ) {
    return this.adminService.flagRisk(
      userId,
      body?.reason || "Risk flag",
      user.id,
    );
  }

  @Get("risk-flags")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "SUPPORT_AGENT")
  listRiskFlags() {
    return this.adminService.listRiskFlags();
  }

  @Post("risk-flags/:id/clear")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  clearRiskFlag(@CurrentUser() user: any, @Param("id") id: string) {
    return this.adminService.clearRiskFlag(id, user.id);
  }

  @Get("promos")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "FINANCE")
  listPromos() {
    return this.adminService.listPromoCodes();
  }

  @Post("promos")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "FINANCE")
  upsertPromo(@Body() body: any) {
    return this.adminService.upsertPromoCode(body);
  }

  @Get("payout-ledger")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "FINANCE")
  getPayoutLedger() {
    return this.adminService.getPayoutLedger();
  }

  @Get("children/:parentId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "SUPPORT_AGENT")
  getChildProfiles(@Param("parentId") parentId: string) {
    return this.adminService.getChildProfiles(parentId);
  }
}