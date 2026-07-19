import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getHistory(params: {
    userId: string;
    bookingId: string;
    page: number;
    limit: number;
  }) {
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
      messages: messages.reverse().map((m) => ({
        id: m.id,
        senderId: m.senderId,
        message: m.message,
        createdAt: m.createdAt,
        isRead: m.isRead,
      })),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }
}
