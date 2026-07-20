import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolve the other participant for a booking-threaded chat.
   * Sender must be the booking parent or the teacher profile's user.
   */
  async resolveCounterpart(bookingId: string, senderId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { teacher: { select: { userId: true } } },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const teacherUserId = booking.teacher.userId;
    const parentId = booking.parentId;

    if (senderId !== parentId && senderId !== teacherUserId) {
      throw new ForbiddenException('Not a participant in this booking chat');
    }

    return {
      bookingId: booking.id,
      parentId,
      teacherUserId,
      receiverId: senderId === parentId ? teacherUserId : parentId,
    };
  }

  async getHistory(params: {
    userId: string;
    bookingId: string;
    page: number;
    limit: number;
  }) {
    await this.resolveCounterpart(params.bookingId, params.userId);

    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    const where = {
      bookingId: params.bookingId,
      OR: [{ senderId: params.userId }, { receiverId: params.userId }],
    };

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.message.count({ where }),
    ]);

    await this.prisma.message.updateMany({
      where: {
        bookingId: params.bookingId,
        receiverId: params.userId,
        isRead: false,
      },
      data: { isRead: true, readAt: new Date() },
    });

    return {
      bookingId: params.bookingId,
      messages: messages.reverse().map((m) => ({
        id: m.id,
        bookingId: m.bookingId,
        senderId: m.senderId,
        receiverId: m.receiverId,
        message: m.message,
        createdAt: m.createdAt,
        isRead: m.isRead,
        attachmentUrl: m.attachmentUrl,
      })),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }
}
