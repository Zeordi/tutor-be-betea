import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class NotificationsService {
  async createNotification(userId: string, data: any) {
    return prisma.notification.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        body: data.body,
        data: data.data || {},
      },
    });
  }

  async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }
}