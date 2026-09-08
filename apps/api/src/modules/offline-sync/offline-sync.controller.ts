import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { OfflineSyncService } from "./offline-sync.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("offline")
export class OfflineSyncController {
  constructor(private readonly offlineSyncService: OfflineSyncService) {}

  @Post("attendance")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  syncAttendance(@CurrentUser() user: any, @Body() body: any) {
    return this.offlineSyncService.syncAttendanceLog(body, user.id);
  }

  @Post("progress")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  syncProgress(@CurrentUser() user: any, @Body() body: any) {
    return this.offlineSyncService.syncProgressReport(body.contractId, body);
  }
}