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

  /** Supports gateway object form and positional args */
  async sendMessage(
    input:
      | string
      | {
          roomId: string;
          senderId: string;
          content: string;
          originalBlocked?: boolean;
        },
    senderId?: string,
    content?: string,
  ) {
    let roomId: string;
    let sid: string;
    let text: string;
    let blocked = false;

    if (typeof input === "string") {
      roomId = input;
      sid = senderId as string;
      text = content as string;
    } else {
      roomId = input.roomId;
      sid = input.senderId;
      text = input.content;
      blocked = !!input.originalBlocked;
    }

    const sanitized = this.sanitizeContent(text);
    return prisma.chatMessage.create({
      data: {
        roomId,
        senderId: sid,
        content: sanitized,
        originalBlocked: blocked || text !== sanitized,
      },
    });
  }

  private sanitizeContent(content: string): string {
    return content
      .replace(/\+251\s*\d{3}\s*\d{3}\s*\d{4}/g, "[RESTRICTED CONTACT INFO]")
      .replace(/09\d{8}/g, "[RESTRICTED CONTACT INFO]")
      .replace(/07\d{8}/g, "[RESTRICTED CONTACT INFO]")
      .replace(/@[a-zA-Z0-9_]+/g, "[RESTRICTED CONTACT INFO]")
      .replace(
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
        "[RESTRICTED CONTACT INFO]",
      )
      .replace(
        /\b\d{4}\s*\d{4}\s*\d{4}\s*\d{4}\b/g,
        "[RESTRICTED CONTACT INFO]",
      );
  }
}