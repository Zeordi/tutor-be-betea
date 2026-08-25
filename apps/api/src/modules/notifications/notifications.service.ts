import { Injectable, Logger } from "@nestjs/common";
import { prisma } from "@tutor/database";

export interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: "default" | null;
  badge?: number;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly expoPushUrl = "https://exp.host/--/api/v2/push/send";

  async registerPushToken(userId: string, pushToken: string) {
    return (prisma.user as any).update({
      where: { id: userId },
      data: { pushToken },
    });
  }

  async create(params: {
    userId: string;
    type: string;
    title: string;
    body: string;
    data?: Record<string, any>;
  }) {
    // 1. Save in database
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        body: params.body,
        data: params.data || {},
      },
    });

    // 2. Dispatch real Expo Push Notification if user has registered token
    const user: any = await prisma.user.findUnique({
      where: { id: params.userId },
    });

    const pushToken = user?.pushToken;

    if (pushToken && typeof pushToken === "string" && pushToken.startsWith("ExponentPushToken[")) {
      await this.sendExpoPush({
        to: pushToken,
        title: params.title,
        body: params.body,
        data: {
          notificationId: notification.id,
          type: params.type,
          ...(params.data || {}),
        },
      });
    }

    return notification;
  }

  private async sendExpoPush(message: PushMessage): Promise<boolean> {
    try {
      const res = await fetch(this.expoPushUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
        },
        body: JSON.stringify({
          to: message.to,
          title: message.title,
          body: message.body,
          data: message.data || {},
          sound: message.sound || "default",
          priority: "high",
        }),
      });

      const result = await res.json().catch(() => ({}));
      this.logger.log(`Expo Push Response: ${JSON.stringify(result)}`);
      return res.ok;
    } catch (err) {
      this.logger.error("Failed to send Expo Push notification", err);
      return false;
    }
  }

  async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }
}