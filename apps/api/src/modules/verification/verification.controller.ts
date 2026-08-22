import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
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
  ) {
    return this.verificationService.approveDocument({
      documentId: id,
      adminId: user.id,
      issueBadges: body.issueBadges,
    });
  }

  @Post(":id/reject")
  reject(@Param("id") id: string, @Body("reason") reason: string) {
    return this.verificationService.rejectDocument(id, reason);
  }
}
