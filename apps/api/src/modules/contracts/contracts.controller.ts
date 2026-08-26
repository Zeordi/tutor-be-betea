import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { ContractsService } from "./contracts.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("contracts")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @Roles("PARENT")
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.contractsService.create({
      parentId: user.id,
      ...body,
    });
  }

  @Post(":id/fund")
  @Roles("PARENT")
  fundEscrow(@Param("id") id: string, @CurrentUser() user: any) {
    return this.contractsService.fundEscrow(id, user.id);
  }

  @Post(":id/session-location")
  @Roles("PARENT")
  updateSessionLocation(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Body() body: { sessionLatitude: number; sessionLongitude: number },
  ) {
    return this.contractsService.updateSessionLocation(
      id,
      user.id,
      Number(body.sessionLatitude),
      Number(body.sessionLongitude),
    );
  }

  @Get("my")
  @Roles("PARENT", "TEACHER")
  myContracts(@CurrentUser() user: any) {
    return this.contractsService.getMyContracts(user.id, user.role);
  }

  @Get(":id")
  @Roles("PARENT", "TEACHER", "SUPER_ADMIN")
  getOne(@Param("id") id: string) {
    return this.contractsService.getById(id);
  }
}
