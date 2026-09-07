import { Controller, Post, Param, Body, UseGuards } from "@nestjs/common";
import { EscrowService } from "./escrow.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("escrow")
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Post("/:contractId/hold")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  holdFunds(@CurrentUser() user: any, @Param("contractId") contractId: string, @Body() body: any) {
    return this.escrowService.holdFunds(contractId, body.amount);
  }

  @Post("/:contractId/release")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  releaseFunds(@Param("contractId") contractId: string) {
    return this.escrowService.releaseFunds(contractId);
  }

  @Post("/webhook/telebirr")
  handleTelebirrWebhook(@Body() body: any) {
    return this.escrowService.handlePaymentWebhook(body.contractId, "telebirr");
  }
}