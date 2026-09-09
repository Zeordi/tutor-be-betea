import { Injectable, BadRequestException } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { randomBytes } from "crypto";

@Injectable()
export class ReferralsService {
  async getOrCreateCode(userId: string) {
    const existing = await prisma.referral.findFirst({
      where: { referrerId: userId, refereeId: null },
      orderBy: { createdAt: "desc" },
    });
    if (existing) return existing;

    const code = "TBB-" + randomBytes(3).toString("hex").toUpperCase();
    return prisma.referral.create({
      data: {
        referrerId: userId,
        code,
        rewardEtb: 200,
        status: "PENDING",
      },
    });
  }

  async listMine(userId: string) {
    return prisma.referral.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        referee: { select: { id: true, fullName: true, createdAt: true } },
      },
    });
  }

  async applyCode(refereeId: string, code: string) {
    const ref = await prisma.referral.findUnique({ where: { code } });
    if (!ref || ref.refereeId) {
      throw new BadRequestException("Invalid or already used code");
    }
    if (ref.referrerId === refereeId) {
      throw new BadRequestException("Cannot use your own code");
    }
    return prisma.referral.update({
      where: { id: ref.id },
      data: { refereeId, status: "EARNED" },
    });
  }
}