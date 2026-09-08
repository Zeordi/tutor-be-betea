import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class ChatService {
  async getMessages(roomId: string) {
    return prisma.chatMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
    });
  }

  async sendMessage(roomId: string, senderId: string, content: string) {
    const sanitized = this.sanitizeContent(content);
    return prisma.chatMessage.create({
      data: {
        roomId,
        senderId,
        content: sanitized,
        originalBlocked: content !== sanitized,
      },
    });
  }

  private sanitizeContent(content: string): string {
    let sanitized = content
      .replace(/\+251\s*\d{3}\s*\d{3}\s*\d{4}/g, "[RESTRICTED CONTACT INFO]")
      .replace(/09\d{8}/g, "[RESTRICTED CONTACT INFO]")
      .replace(/07\d{8}/g, "[RESTRICTED CONTACT INFO]")
      .replace(/@[a-zA-Z0-9_]+/g, "[RESTRICTED CONTACT INFO]")
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, "[RESTRICTED CONTACT INFO]")
      .replace(/\b\d{4}\s*\d{4}\s*\d{4}\s*\d{4}\b/g, "[RESTRICTED CONTACT INFO]");
    return sanitized;
  }
}