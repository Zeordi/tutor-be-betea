import { Module } from "@nestjs/common";
import { VerificationService } from "./verification.service";
import { VerificationController } from "./verification.controller";
import { VaultModule } from "../vault/vault.module";
import { BadgesModule } from "../badges/badges.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [VaultModule, BadgesModule, NotificationsModule],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
