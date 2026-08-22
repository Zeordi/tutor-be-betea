import { Module } from "@nestjs/common";
import { OfflineSyncService } from "./offline-sync.service";
import { OfflineSyncController } from "./offline-sync.controller";
import { AttendanceModule } from "../attendance/attendance.module";

@Module({
  imports: [AttendanceModule],
  controllers: [OfflineSyncController],
  providers: [OfflineSyncService],
})
export class OfflineSyncModule {}
