import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { EscrowService } from "../escrow/escrow.service";

@Injectable()
export class JobsQueueService {
  constructor(private readonly escrowService: EscrowService) {}

  /** Expire open jobs past expiresAt. ApplicationStatus has no APPROVED. */
  async processApplications() {
    const expired = await prisma.parentJob.updateMany({
      where: {
        status: "OPEN",
        expiresAt: { lt: new Date() },
      },
      data: { status: "EXPIRED" },
    });
    return { expiredJobs: expired.count };
  }

  /** Auto-release ACTIVE contracts whose end date has passed */
  async processExpiredContracts() {
    return this.escrowService.autoReleaseExpiredContracts();
  }
}