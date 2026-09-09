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
@Roles("SUPER_ADMIN")
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get("queue")
  getQueue() {
    return this.verificationService.getPendingQueue();
  }

  @Post(":id/approve")
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
}