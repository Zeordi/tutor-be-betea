import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
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
  initiatePayment(@Body() body: any) {
    return this.paymentsService.initiatePayment(body);
  }

  @Post("webhook/telebirr")
  handleTelebirrWebhook(@Body() body: any) {
    return this.paymentsService.handleWebhook("TELEBIRR", body);
  }

  @Post("webhook/cbe")
  handleCbeWebhook(@Body() body: any) {
    return this.paymentsService.handleWebhook("CBE_BIRR", body);
  }
}