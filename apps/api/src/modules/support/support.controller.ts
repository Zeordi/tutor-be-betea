import { Controller, Post, Get, Param, Body, UseGuards } from "@nestjs/common";
import { SupportService } from "./support.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("support")
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT", "TEACHER")
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.supportService.createTicket({ ...body, userId: user.id });
  }

  @Get(":contractId")
  getByContract(@Param("contractId") contractId: string) {
    return this.supportService.getTicketsByContract(contractId);
  }
}