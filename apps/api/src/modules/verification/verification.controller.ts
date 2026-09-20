import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import type { Request } from "express";
import { VerificationService } from "./verification.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("verification")
@UseGuards(JwtAuthGuard, RolesGuard)
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get("queue")
  @Roles("SUPER_ADMIN", "VERIFICATION_OFFICER")
  getQueue() {
    return this.verificationService.getPendingQueue();
  }

  @Get("status")
  @Roles("TEACHER")
  getTeacherStatus(@CurrentUser() user: any) {
    return this.verificationService.getTeacherVerificationStatus(user.id);
  }

  @Post(":id/approve")
  @Roles("SUPER_ADMIN", "VERIFICATION_OFFICER")
  approve(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Body() body: { issueBadges?: string[] },
    @Req() req: Request,
  ) {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    return this.verificationService.approveDocument({
      documentId: id,
      adminId: user.id,
      issueBadges: body.issueBadges,
      ipAddress: ip,
    });
  }

  @Post(":id/reject")
  @Roles("SUPER_ADMIN", "VERIFICATION_OFFICER")
  reject(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Body() body: { reason?: string },
    @Req() req: Request,
  ) {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    return this.verificationService.rejectDocument({
      documentId: id,
      adminId: user.id,
      reason: body.reason || "Please re-submit clearer documents.",
      ipAddress: ip,
    });
  }

  @Post(":id/request-more")
  @Roles("SUPER_ADMIN", "VERIFICATION_OFFICER")
  requestMore(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Body() body: { reason: string },
    @Req() req: Request,
  ) {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    return this.verificationService.requestMoreInfo({
      documentId: id,
      adminId: user.id,
      reason: body.reason || "Please provide additional information.",
      ipAddress: ip,
    });
  }

  @Post(":id/revoke")
  @Roles("SUPER_ADMIN", "VERIFICATION_OFFICER")
  revoke(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Body() body: { reason?: string },
    @Req() req: Request,
  ) {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    return this.verificationService.revokeDocument({
      documentId: id,
      adminId: user.id,
      reason: body.reason || "Verification revoked.",
      ipAddress: ip,
    });
  }
}