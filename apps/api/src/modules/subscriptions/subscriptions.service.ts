import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class SubscriptionsService {
  async getMine(userId: string) {
    return prisma.subscription.findFirst({
      where: { userId, active: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async upsertTier(userId: string, tier: "BASIC" | "PREMIUM" | "ELITE") {
    await prisma.subscription.updateMany({
      where: { userId, active: true },
      data: { active: false, endsAt: new Date() },
    });
    return prisma.subscription.create({
      data: {
        userId,
        tier,
        active: true,
        startsAt: new Date(),
      },
    });
  }
}