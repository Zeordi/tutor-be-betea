import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { ConnectsService } from "./connects.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("connects")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("TEACHER")
export class ConnectsController {
  constructor(private readonly connectsService: ConnectsService) {}

  @Get("balance")
  balance(@CurrentUser() user: any) {
    return this.connectsService.getBalance(user.id);
  }

  @Post("top-up")
  topUp(@CurrentUser() user: any, @Body() body: { amount: number }) {
    return this.connectsService.topUp(user.id, Number(body.amount));
  }
}