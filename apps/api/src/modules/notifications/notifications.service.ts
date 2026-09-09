import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class NotificationsService {
  async createNotification(userId: string, data: any) {
    return prisma.notification.create({
      data: {
        userId,
        type: data.type || "SYSTEM",
        title: data.title,
        body: data.body,
        data: data.data ?? undefined,
      },
    });
  }

  async getUserNotifications(userId: string, type?: string) {
    return prisma.notification.findMany({
      where: {
        userId,
        ...(type && type !== "ALL" ? { type } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async markRead(userId: string, id: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }

  async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}