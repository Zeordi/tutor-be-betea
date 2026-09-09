import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { AttendanceService } from "./attendance.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post("check-in")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  checkIn(@CurrentUser() user: any, @Body() body: any) {
    return this.attendanceService.checkIn(
      body.contractId,
      user.id,
      body.latitude,
      body.longitude,
      body.offlineId,
    );
  }

  @Post("check-out")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  checkOut(@CurrentUser() user: any, @Body() body: any) {
    return this.attendanceService.checkOut(body.contractId, user.id);
  }

  @Get("contract/:contractId")
  @UseGuards(JwtAuthGuard)
  byContract(@Param("contractId") contractId: string) {
    return this.attendanceService.getContractAttendance(contractId);
  }

  @Post(":id/confirm")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  confirm(@CurrentUser() user: any, @Param("id") id: string) {
    return this.attendanceService.parentConfirm(id, user.id);
  }
}