import { Module } from "@nestjs/common";
import { JobsQueueService } from "./jobs-queue.service";
import { EscrowModule } from "../escrow/escrow.module";

@Module({
  imports: [EscrowModule],
  providers: [JobsQueueService],
  exports: [JobsQueueService],
})
export class JobsQueueModule {}
