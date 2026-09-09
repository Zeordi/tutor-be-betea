import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { ReferralsService } from "./referrals.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("referrals")
@UseGuards(JwtAuthGuard)
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Get("code")
  getCode(@CurrentUser() user: any) {
    return this.referralsService.getOrCreateCode(user.id);
  }

  @Get("mine")
  listMine(@CurrentUser() user: any) {
    return this.referralsService.listMine(user.id);
  }

  @Post("apply")
  apply(@CurrentUser() user: any, @Body() body: { code: string }) {
    return this.referralsService.applyCode(user.id, body.code);
  }
}