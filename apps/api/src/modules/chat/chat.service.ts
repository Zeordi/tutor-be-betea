import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { AntiPoachingService } from "./anti-poaching.service";

@Injectable()
export class ChatService {
  constructor(private readonly antiPoachingService: AntiPoachingService) {}

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

    const scan = this.antiPoachingService.sanitize(text);
    return prisma.chatMessage.create({
      data: {
        roomId,
        senderId: sid,
        content: scan.sanitizedText,
        originalBlocked: blocked || scan.blocked,
      },
    });
  }
}