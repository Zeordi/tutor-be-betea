import { Controller, Post, Get, Param, Body, UseGuards } from "@nestjs/common";
import { AttendanceService } from "./attendance.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post(":contractId/check-in")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  checkIn(@CurrentUser() user: any, @Param("contractId") contractId: string, @Body() body: any) {
    return this.attendanceService.checkIn(contractId, user.id, body.latitude, body.longitude);
  }

  @Post(":contractId/check-out")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  checkOut(@CurrentUser() user: any, @Param("contractId") contractId: string) {
    return this.attendanceService.checkOut(contractId, user.id);
  }

  @Get(":contractId")
  getContractAttendance(@Param("contractId") contractId: string) {
    return this.attendanceService.getContractAttendance(contractId);
  }
}