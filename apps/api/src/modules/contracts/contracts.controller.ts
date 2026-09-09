import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ContractsService } from "./contracts.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("contracts")
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.contractsService.createContract(user.id, body);
  }

  /** Static paths BEFORE :id */
  @Get("mine/parent")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  listParent(@CurrentUser() user: any) {
    return this.contractsService.listForParent(user.id);
  }

  @Get("mine/teacher")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  listTeacher(@CurrentUser() user: any) {
    return this.contractsService.listForTeacher(user.id);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  getById(@Param("id") id: string) {
    return this.contractsService.getContract(id);
  }

  @Post(":id/release")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "FINANCE")
  releaseEscrow(@CurrentUser() user: any, @Param("id") id: string) {
    return this.contractsService.releaseEscrow(id, user.id);
  }
}