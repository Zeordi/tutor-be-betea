import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class ChatService {
  async getMessages(roomId: string, limit = 50) {
    return prisma.chatMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      take: limit > 0 ? limit : 50,
    });
  }

  async saveMessage(params: {
    roomId: string;
    senderId: string;
    content: string;
    originalBlocked?: boolean;
  }) {
    return prisma.chatMessage.create({
      data: {
        roomId: params.roomId,
        senderId: params.senderId,
        content: params.content,
        originalBlocked: params.originalBlocked || false,
      },
    });
  }
}