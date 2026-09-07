import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { DailyService } from "../../lib/daily"; // or LiveKit / Agora

@Injectable()
export class VideoService {
  async createRoom(contractId: string, teacherId: string) {
    const contract = await prisma.tutoringContract.findUnique({
      where: { id: contractId },
    });
    if (!contract) throw new Error("Contract not found");

    const room = await DailyService.createRoom({
      name: `session-${contractId}`,
      properties: {
        start_audio_off: true,
        start_video_off: true,
        enable_chat: true,
        enable_knocking: false,
      },
    });

    // Store room in DB for audit
    await prisma.contract.update({
      where: { id: contractId },
      data: { sessionRoomId: room.id },
    });

    return { roomId: room.id, joinUrl: room.join_url };
  }

  async joinRoom(roomId: string, userId: string) {
    const room = await DailyService.joinRoom(roomId);
    return { roomId, joinUrl: room.join_url };
  }

  async endSession(contractId: string, userId: string) {
    await prisma.attendanceLog.updateMany({
      where: { contractId, checkOutTime: null },
      data: { checkOutTime: new Date() },
    });
    return { success: true };
  }
}