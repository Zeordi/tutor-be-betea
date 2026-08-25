import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
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
      teacherId: user.id,
      contractId: body.contractId,
      latitude: Number(body.latitude),
      longitude: Number(body.longitude),
      parentLat:
        body.parentLat !== undefined ? Number(body.parentLat) : undefined,
      parentLng:
        body.parentLng !== undefined ? Number(body.parentLng) : undefined,
    });
  }

  @Post("check-out")
  @Roles("TEACHER")
  checkOut(@CurrentUser() user: any, @Body() body: any) {
    return this.attendanceService.checkOut({
      teacherId: user.id,
      contractId: body.contractId,
      latitude: Number(body.latitude),
      longitude: Number(body.longitude),
    });
  }

  @Get("contract/:contractId")
  @Roles("PARENT", "TEACHER")
  getByContract(@Param("contractId") contractId: string) {
    return this.attendanceService.getByContract(contractId);
  }

  @Post(":id/confirm")
  @Roles("PARENT")
  confirm(@Param("id") id: string, @CurrentUser() user: any) {
    return this.attendanceService.confirmByParent(id, user.id);
  }
}