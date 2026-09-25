import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { HealthModule } from "./common/health/health.module";
import { LoggerModule } from "./common/logging/logger.module";
import {
  AuthRateLimitMiddleware,
  PaymentRateLimitMiddleware,
  GeneralRateLimitMiddleware,
} from "./common/middleware/simple-rate-limit.middleware";
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
    HealthModule,
    LoggerModule,
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
  providers: [
    AuthRateLimitMiddleware,
    PaymentRateLimitMiddleware,
    GeneralRateLimitMiddleware,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthRateLimitMiddleware)
      .forRoutes(
        { path: "auth/otp/send", method: RequestMethod.POST },
        { path: "auth/otp/verify", method: RequestMethod.POST },
        { path: "auth/login", method: RequestMethod.POST },
        { path: "auth/register", method: RequestMethod.POST },
        { path: "auth/password/forgot", method: RequestMethod.POST },
        { path: "auth/password/reset", method: RequestMethod.POST },
        { path: "auth/refresh", method: RequestMethod.POST },
        { path: "auth/google", method: RequestMethod.POST },
        { path: "auth/logout", method: RequestMethod.POST },
        { path: "verification/:id/revoke", method: RequestMethod.POST },
      )
      .apply(PaymentRateLimitMiddleware)
      .forRoutes(
        { path: "payments/initiate", method: RequestMethod.POST },
        { path: "payments/payout", method: RequestMethod.POST },
      )
      .apply(GeneralRateLimitMiddleware)
      .forRoutes(
        { path: "chat/:roomId/messages", method: RequestMethod.POST },
        { path: "support", method: RequestMethod.POST },
        { path: "jobs", method: RequestMethod.POST },
        { path: "jobs/:jobId/apply", method: RequestMethod.POST },
        { path: "contracts", method: RequestMethod.POST },
        { path: "contracts/:id/release", method: RequestMethod.POST },
        { path: "attendance/check-in", method: RequestMethod.POST },
        { path: "attendance/check-out", method: RequestMethod.POST },
        { path: "offline/progress", method: RequestMethod.POST },
        { path: "offline/support", method: RequestMethod.POST },
        { path: "progress/:contractId", method: RequestMethod.POST },
        { path: "video/:contractId/room", method: RequestMethod.POST },
        { path: "video/:contractId/end", method: RequestMethod.POST },
        { path: "notifications/:id/read", method: RequestMethod.POST },
        { path: "notifications/read-all", method: RequestMethod.POST },
        { path: "parents/children", method: RequestMethod.POST },
        { path: "teachers/me/location", method: RequestMethod.POST },
        { path: "teachers/profile", method: RequestMethod.POST },
        { path: "referrals/apply", method: RequestMethod.POST },
        { path: "reviews", method: RequestMethod.POST },
        { path: "replacements", method: RequestMethod.POST },
        { path: "availability/packages", method: RequestMethod.POST },
        { path: "connects/top-up", method: RequestMethod.POST },
        { path: "subscriptions/upgrade", method: RequestMethod.POST },
        { path: "favorites/:teacherId", method: RequestMethod.POST },
        { path: "blog/admin", method: RequestMethod.POST },
        { path: "audit/log", method: RequestMethod.POST },
        { path: "admin/verification/:userId/approve", method: RequestMethod.POST },
        { path: "admin/verification/:userId/reject", method: RequestMethod.POST },
        { path: "admin/risk-flag/:userId", method: RequestMethod.POST },
        { path: "admin/risk-flags/:id/clear", method: RequestMethod.POST },
        { path: "admin/promos", method: RequestMethod.POST },
        { path: "admin/impersonate/:userId", method: RequestMethod.POST },
        { path: "admin/staff", method: RequestMethod.POST },
      );
  }
}
