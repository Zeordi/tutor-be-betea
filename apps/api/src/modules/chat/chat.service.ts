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

  async sendMessage(roomId: string, senderId: string, content: string) {
    const scan = this.antiPoachingService.sanitize(content);
    return prisma.chatMessage.create({
      data: {
        roomId,
        senderId,
        content: scan.sanitizedText,
        originalBlocked: scan.blocked,
      },
    });
  }

  async isValidRoom(roomId: string, requesterId: string): Promise<boolean> {
    const peer = await prisma.user.findUnique({
      where: { id: roomId },
      select: { id: true },
    });
    if (!peer) return false;

    const contract = await prisma.tutoringContract.findFirst({
      where: {
        OR: [
          { parentId: requesterId, teacherId: roomId },
          { teacherId: requesterId, parentId: roomId },
        ],
        status: { in: ["PENDING_ESCROW", "ACTIVE", "DISPUTED", "COMPLETED"] },
      },
      select: { id: true },
    });

    return !!contract;
  }
}
