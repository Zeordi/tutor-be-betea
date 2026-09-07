import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class JobsQueueService {
  async processApplications() {
    await prisma.application.updateMany({
      where: {
        status: "PENDING",
        job: { status: "OPEN" },
      },
      data: { status: "APPROVED" },
    });
  }
}