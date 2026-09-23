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

  async listPlans() {
    return [
      {
        id: "basic",
        name: "Basic",
        description: "Essential tutoring access",
        price: 490,
        currency: "ETB",
        billingCycle: "monthly",
        maxChildren: 1,
        features: [
          "1 child profile",
          "Basic tutor search",
          "Standard support",
        ],
      },
      {
        id: "premium",
        name: "Premium",
        description: "Full access for families",
        price: 990,
        currency: "ETB",
        billingCycle: "monthly",
        maxChildren: 3,
        features: [
          "Up to 3 children",
          "Priority tutor matching",
          "Session recording",
          "Priority support",
        ],
      },
      {
        id: "elite",
        name: "Elite",
        description: "Unlimited family plan",
        price: 1990,
        currency: "ETB",
        billingCycle: "monthly",
        maxChildren: 10,
        features: [
          "Up to 10 children",
          "Dedicated success manager",
          "Advanced analytics",
          "24/7 support",
        ],
      },
    ];
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
