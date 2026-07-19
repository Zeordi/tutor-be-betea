import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async sendBookingRequestNotification(params: {
    bookingId: string;
    teacherId: string;
    parentId: string;
  }) {
    return this.createForUsers(
      [params.parentId],
      NotificationType.BOOKING,
      'Booking requested',
      `A new booking request was created (${params.bookingId}).`,
      params,
    );
  }

  async sendBookingConfirmedNotification(params: {
    bookingId: string;
    teacherId: string;
    parentId: string;
  }) {
    return this.createForUsers(
      [params.parentId],
      NotificationType.BOOKING,
      'Booking confirmed',
      `Your booking ${params.bookingId} was confirmed.`,
      params,
    );
  }

  async sendLessonCompletedNotification(params: {
    bookingId: string;
    teacherId: string;
    parentId: string;
  }) {
    return this.createForUsers(
      [params.parentId],
      NotificationType.BOOKING,
      'Lesson completed',
      `Booking ${params.bookingId} was marked complete.`,
      params,
    );
  }

  async sendBookingCancelledNotification(params: {
    bookingId: string;
    teacherId: string;
    parentId: string;
    reason: string;
  }) {
    return this.createForUsers(
      [params.parentId],
      NotificationType.BOOKING,
      'Booking cancelled',
      `Booking ${params.bookingId} was cancelled: ${params.reason}`,
      params,
    );
  }

  async sendPushNotification(params: {
    userId: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }) {
    this.logger.log(`Push notification to=${params.userId} title=${params.title}`);
    return this.createForUsers(
      [params.userId],
      NotificationType.MESSAGE,
      params.title,
      params.body,
      params.data || {},
    );
  }

  private async createForUsers(
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
    data: Record<string, unknown>,
  ) {
    this.logger.log(`${title}: ${message}`);
    await Promise.all(
      userIds.map((userId) =>
        this.prisma.notification.create({
          data: {
            userId,
            type,
            title,
            message,
            data,
          },
        }),
      ),
    );
    return { queued: true };
  }
}
