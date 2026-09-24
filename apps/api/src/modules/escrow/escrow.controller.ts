import { Controller, Post, Param, Body, UseGuards } from "@nestjs/common";
import { EscrowService } from "./escrow.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("escrow")
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Post(":contractId/hold")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  holdFunds(
    @CurrentUser() user: any,
    @Param("contractId") contractId: string,
    @Body() body: any,
  ) {
    return this.escrowService.holdFunds(contractId, body.amount);
  }

  @Post(":contractId/release")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT", "SUPER_ADMIN", "FINANCE")
  releaseFunds(@CurrentUser() user: any, @Param("contractId") contractId: string) {
    return this.escrowService.releaseFunds(contractId, user.id, user.role);
  }

  @Post("auto-release")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "FINANCE")
  autoReleaseExpired(@CurrentUser() user: any) {
    return this.escrowService.autoReleaseExpiredContracts();
  }
}