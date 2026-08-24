import { Controller, Get, UseGuards } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("payments")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Parent wallet
  @Get("wallet")
  @Roles("PARENT")
  getWallet(@CurrentUser() user: any) {
    return this.paymentsService.getParentWallet(user.id);
  }

  // Teacher earnings
  @Get("earnings")
  @Roles("TEACHER")
  getEarnings(@CurrentUser() user: any) {
    return this.paymentsService.getTeacherEarnings(user.id);
  }
}