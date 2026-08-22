import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("initiate")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  initiate(@Body() body: any) {
    return this.paymentsService.initiatePayment(body);
  }

  @Post("webhook/telebirr")
  telebirrWebhook(@Body() body: any) {
    return this.paymentsService.handleWebhook("TELEBIRR", body);
  }

  @Post("webhook/cbe")
  cbeWebhook(@Body() body: any) {
    return this.paymentsService.handleWebhook("CBE_BIRR", body);
  }
}
