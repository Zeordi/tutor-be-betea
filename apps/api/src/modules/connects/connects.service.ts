import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class ConnectsService {
  async getBalance(teacherId: string) {
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: teacherId },
    });
    if (!profile) throw new NotFoundException("Teacher profile not found");
    const ledger = await prisma.connectTransaction.findMany({
      where: { teacherId },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    return { balance: profile.connectsBalance, ledger };
  }

  async topUp(teacherId: string, amount: number) {
    if (!amount || amount < 1) throw new BadRequestException("Invalid amount");
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: teacherId },
    });
    if (!profile) throw new NotFoundException("Teacher profile not found");

    const newBalance = profile.connectsBalance + amount;
    await prisma.$transaction([
      prisma.teacherProfile.update({
        where: { userId: teacherId },
        data: { connectsBalance: newBalance },
      }),
      prisma.connectTransaction.create({
        data: {
          teacherId,
          delta: amount,
          reason: "TOP_UP",
          balanceAfter: newBalance,
        },
      }),
    ]);
    return { balance: newBalance };
  }
}