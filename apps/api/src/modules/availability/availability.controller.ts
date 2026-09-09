import { Controller, Get, Put, Post, Body, UseGuards } from "@nestjs/common";
import { AvailabilityService } from "./availability.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("availability")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("TEACHER")
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get("mine")
  getMine(@CurrentUser() user: any) {
    return this.availabilityService.getMine(user.id);
  }

  @Put("slots")
  setSlots(@CurrentUser() user: any, @Body() body: { slots: any[] }) {
    return this.availabilityService.setSlots(user.id, body.slots || []);
  }

  @Post("packages")
  upsertPackage(@CurrentUser() user: any, @Body() body: any) {
    return this.availabilityService.upsertPackage(user.id, body);
  }
}