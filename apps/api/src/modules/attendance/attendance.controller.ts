import { Controller, Post, Get, Body, Param, UseGuards } from "@nestjs/common";
import { AttendanceService } from "./attendance.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("attendance")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post("check-in")
  @Roles("TEACHER")
  checkIn(@CurrentUser() user: any, @Body() body: any) {
    return this.attendanceService.checkIn({
      ...body,
      teacherId: user.id,
    });
  }

  @Post("check-out")
  @Roles("TEACHER")
  checkOut(@CurrentUser() user: any, @Body() body: any) {
    return this.attendanceService.checkOut({
      ...body,
      teacherId: user.id,
    });
  }

  @Post(":id/confirm")
  @Roles("PARENT")
  parentConfirm(@Param("id") id: string, @CurrentUser() user: any) {
    return this.attendanceService.parentConfirm(id, user.id);
  }

  @Get("contract/:contractId")
  @Roles("PARENT", "TEACHER", "SUPER_ADMIN")
  getContractAttendance(@Param("contractId") contractId: string) {
    return this.attendanceService.getContractAttendance(contractId);
  }
}
