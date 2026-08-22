import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { OfflineSyncService } from "./offline-sync.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("offline-sync")
@UseGuards(JwtAuthGuard, RolesGuard)
export class OfflineSyncController {
  constructor(private readonly offlineSyncService: OfflineSyncService) {}

  @Post("attendance")
  @Roles("TEACHER")
  syncAttendance(@CurrentUser() user: any, @Body() body: any) {
    return this.offlineSyncService.syncAttendanceBatch({
      teacherId: user.id,
      records: body.records,
    });
  }
}
