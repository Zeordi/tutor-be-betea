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

  async getConversations(userId: string) {
    const myRooms = await prisma.chatMessage.findMany({
      where: { senderId: userId },
      select: { roomId: true },
      distinct: ["roomId"],
    });

    const roomIds = myRooms.map((m) => m.roomId);
    if (roomIds.length === 0) return [];

    const [lastMessages, counts] = await Promise.all([
      prisma.chatMessage.findMany({
        where: { roomId: { in: roomIds } },
        orderBy: { createdAt: "asc" },
      }),
      prisma.chatMessage.groupBy({
        by: ["roomId", "senderId"],
        where: { roomId: { in: roomIds } },
        _count: { _all: true },
      }),
    ]);

    const byRoom = new Map<string, any>();
    for (const m of lastMessages) {
      byRoom.set(m.roomId, m);
    }

    const unreadByRoom = new Map<string, number>();
    for (const c of counts) {
      if (c.senderId !== userId) {
        unreadByRoom.set(c.roomId, (unreadByRoom.get(c.roomId) || 0) + (c._count?._all ?? 0));
      }
    }

    const teacherIds = roomIds.filter((id) => id !== userId);
    const teachers = teacherIds.length
      ? await prisma.user.findMany({
          where: { id: { in: teacherIds } },
          select: { id: true, fullName: true, avatarUrl: true },
        })
      : [];
    const teacherMap = new Map(teachers.map((t) => [t.id, t]));

    return roomIds.map((roomId) => {
      const other = teacherMap.get(roomId);
      const last = byRoom.get(roomId);
      return {
        id: roomId,
        otherUser: other
          ? {
              id: other.id,
              fullName: other.fullName,
              avatarUrl: other.avatarUrl,
            }
          : { id: roomId, fullName: "Tutor", avatarUrl: null },
        lastMessage: last
          ? { body: last.content, createdAt: last.createdAt.toISOString() }
          : null,
        unreadCount: unreadByRoom.get(roomId) || 0,
      };
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
