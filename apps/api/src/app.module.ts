import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
// ... existing module imports ...
import { SimpleRateLimitMiddleware } from "./common/middleware/simple-rate-limit.middleware";

import { DatabaseModule } from "./database/database.module";

import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { TeachersModule } from "./modules/teachers/teachers.module";
import { ParentsModule } from "./modules/parents/parents.module";
import { VaultModule } from "./modules/vault/vault.module";
import { VerificationModule } from "./modules/verification/verification.module";
import { BadgesModule } from "./modules/badges/badges.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { MatchingModule } from "./modules/matching/matching.module";
import { ContractsModule } from "./modules/contracts/contracts.module";
import { AttendanceModule } from "./modules/attendance/attendance.module";
import { OfflineSyncModule } from "./modules/offline-sync/offline-sync.module";
import { ChatModule } from "./modules/chat/chat.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { EscrowModule } from "./modules/escrow/escrow.module";
import { ProgressModule } from "./modules/progress/progress.module";
import { VideoModule } from "./modules/video/video.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { SupportModule } from "./modules/support/support.module";
import { AuditModule } from "./modules/audit/audit.module";
import { AdminModule } from "./modules/admin/admin.module";
import { JobsQueueModule } from "./modules/jobs-queue/jobs-queue.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    TeachersModule,
    ParentsModule,
    VaultModule,
    VerificationModule,
    BadgesModule,
    JobsModule,
    MatchingModule,
    ContractsModule,
    AttendanceModule,
    OfflineSyncModule,
    ChatModule,
    PaymentsModule,
    EscrowModule,
    ProgressModule,
    VideoModule,
    NotificationsModule,
    SupportModule,
    AuditModule,
    AdminModule,
    JobsQueueModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SimpleRateLimitMiddleware)
      .forRoutes(
        "auth/otp/send",
        "auth/otp/verify",
        "auth/login",
        "auth/register",
        "vault/upload",
        "offline/attendance",
      );
  }
}