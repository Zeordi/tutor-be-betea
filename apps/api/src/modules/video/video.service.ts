import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { DailyService } from "../../lib/daily";

@Injectable()
export class VideoService {
  async createRoom(contractId: string, teacherId: string) {
    const contract = await prisma.tutoringContract.findFirst({
      where: { id: contractId, teacherId },
    });
    if (!contract) throw new NotFoundException("Contract not found");

    const room = await DailyService.createRoom({
      name: "session-" + contractId,
      properties: {
        start_audio_off: true,
        start_video_off: true,
        enable_chat: true,
      },
    });

    await prisma.tutoringContract.update({
      where: { id: contractId },
      data: { sessionRoomId: room.id },
    });

    return { roomId: room.id, joinUrl: room.join_url };
  }

  async joinRoom(contractId: string, userId: string) {
    const contract = await prisma.tutoringContract.findFirst({
      where: {
        id: contractId,
        OR: [{ parentId: userId }, { teacherId: userId }],
      },
    });
    if (!contract) throw new NotFoundException("Contract not found");

    const roomId = contract.sessionRoomId || "session-" + contractId;
    const room = await DailyService.joinRoom(roomId);
    return { roomId: room.id, joinUrl: room.join_url };
  }

  async endSession(contractId: string, _userId: string) {
    await prisma.attendanceLog.updateMany({
      where: { contractId, checkOutTime: null },
      data: { checkOutTime: new Date() },
    });
    return { success: true };
  }
}