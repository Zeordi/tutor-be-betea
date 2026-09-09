import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class JobsQueueService {
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
}