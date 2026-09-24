import { Controller, Post, Param, Body, UseGuards, Req } from "@nestjs/common";
import { EscrowService } from "./escrow.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { verifyTelebirrSignature, paymentConfig } from "../../config/payment.config";
import { Request } from "express";

@Controller("escrow")
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Post(":contractId/hold")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  holdFunds(
    @CurrentUser() user: any,
    @Param("contractId") contractId: string,
    @Body() body: any,
  ) {
    return this.escrowService.holdFunds(contractId, body.amount);
  }

  @Post(":contractId/release")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT", "SUPER_ADMIN", "FINANCE")
  releaseFunds(@CurrentUser() user: any, @Param("contractId") contractId: string) {
    return this.escrowService.releaseFunds(contractId, user.id, user.role);
  }

  @Post("webhook/telebirr")
  handleTelebirrWebhook(@Req() req: Request, @Body() body: any) {
    const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
    const signature = req.headers["x-telebirr-signature"] as string | undefined;
    if (!verifyTelebirrSignature(raw, signature, paymentConfig.telebirr.apiSecret)) {
      return { ok: false, reason: "invalid_signature" };
    }
    return this.escrowService.handlePaymentWebhook(
      body.contractId,
      "TELEBIRR",
    );
  }

  @Post("auto-release")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "FINANCE")
  autoReleaseExpired(@CurrentUser() user: any) {
    return this.escrowService.autoReleaseExpiredContracts();
  }
}