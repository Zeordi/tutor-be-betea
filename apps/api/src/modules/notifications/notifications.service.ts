import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class NotificationsService {
  async create(params: {
    userId: string;
    type: string;
    title: string;
    body: string;
    data?: any;
  }) {
    return prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        body: params.body,
        data: params.data || {},
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
