import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

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
import { FavoritesModule } from "./modules/favorites/favorites.module";
import { ReferralsModule } from "./modules/referrals/referrals.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";
import { ConnectsModule } from "./modules/connects/connects.module";
import { AvailabilityModule } from "./modules/availability/availability.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { ReplacementsModule } from "./modules/replacements/replacements.module";
import { BlogModule } from "./modules/blog/blog.module";

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
    FavoritesModule,
    ReferralsModule,
    SubscriptionsModule,
    ConnectsModule,
    AvailabilityModule,
    ReviewsModule,
    ReplacementsModule,
    BlogModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SimpleRateLimitMiddleware)
      .forRoutes(
        { path: "auth/otp/send", method: RequestMethod.POST },
        { path: "auth/otp/verify", method: RequestMethod.POST },
        { path: "auth/login", method: RequestMethod.POST },
        { path: "auth/register", method: RequestMethod.POST },
        { path: "vault/upload", method: RequestMethod.POST },
        { path: "offline/attendance", method: RequestMethod.POST },
      );
  }
}