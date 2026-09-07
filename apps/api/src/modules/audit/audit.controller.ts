import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AuditService } from "./audit.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("audit")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post("log")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  logAction(@CurrentUser() user: any, @Body() body: any) {
    return this.auditService.logAdminAction(user.id, body.actionType, body.targetUserId, body.reason);
  }
}