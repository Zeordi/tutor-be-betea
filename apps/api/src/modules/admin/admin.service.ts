import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class AdminService {
  async getDashboardStats() {
    const [totalParents, verifiedTutors, activeContracts, pendingVerifications] =
      await Promise.all([
        prisma.user.count({ where: { role: "PARENT" } }),
        prisma.teacherProfile.count({ where: { isIdVerified: true } }),
        prisma.tutoringContract.count({ where: { status: "ACTIVE" } }),
        prisma.vaultDocument.count({ where: { status: "PENDING" } }),
      ]);

    return {
      totalParents,
      verifiedTutors,
      activeContracts,
      pendingVerifications,
    };
  }
}
