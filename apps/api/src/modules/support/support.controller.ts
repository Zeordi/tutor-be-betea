import { Controller, Post, Get, Body, Query, UseGuards } from "@nestjs/common";
import { SupportService } from "./support.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("support")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post("tickets")
  @Roles("PARENT", "TEACHER")
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.supportService.createTicket({
      ...body,
      submittedBy: user.id,
    });
  }

  @Get("tickets")
  @Roles("SUPER_ADMIN", "SUPPORT_AGENT")
  getTickets(@Query("status") status?: string) {
    return this.supportService.getTickets(status);
  }
}
