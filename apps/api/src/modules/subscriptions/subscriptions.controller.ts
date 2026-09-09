import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { SubscriptionsService } from "./subscriptions.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("subscriptions")
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get("mine")
  getMine(@CurrentUser() user: any) {
    return this.subscriptionsService.getMine(user.id);
  }

  @Post("upgrade")
  upgrade(
    @CurrentUser() user: any,
    @Body() body: { tier: "BASIC" | "PREMIUM" | "ELITE" },
  ) {
    return this.subscriptionsService.upsertTier(user.id, body.tier);
  }
}