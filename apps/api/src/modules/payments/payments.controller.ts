import { Controller, Post, Get, Body, UseGuards } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get("wallet")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  getWallet(@CurrentUser() user: any) {
    return this.paymentsService.getParentWallet(user.id);
  }

  @Get("earnings")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  getEarnings(@CurrentUser() user: any) {
    return this.paymentsService.getTeacherEarnings(user.id);
  }

  @Post("initiate")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  initiatePayment(@CurrentUser() user: any, @Body() body: any) {
    return this.paymentsService.initiatePayment({
      userId: user.id,
      contractId: body.contractId,
      amount: body.amount,
      provider: body.provider,
    });
  }

  @Post("payout")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  requestPayout(@CurrentUser() user: any, @Body() body: any) {
    return this.paymentsService.requestPayout(
      user.id,
      Number(body.amount),
      body.provider,
    );
  }

  @Post("webhook/telebirr")
  handleTelebirrWebhook(@Body() body: any) {
    return this.paymentsService.handleWebhook("TELEBIRR", body);
  }

  @Post("webhook/cbe")
  handleCbeWebhook(@Body() body: any) {
    return this.paymentsService.handleWebhook("CBE_BIRR", body);
  }

  @Post("webhook/mpesa")
  handleMpesaWebhook(@Body() body: any) {
    return this.paymentsService.handleWebhook("MPESA", body);
  }
}