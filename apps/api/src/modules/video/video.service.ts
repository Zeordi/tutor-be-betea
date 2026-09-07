import { Injectable } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class VideoService {
  async createRoom(contractId: string, teacherId: string) {
    // Daily.co / LiveKit integration placeholder
    return { roomId: `room-\( {contractId}- \){Date.now()}` };
  }

  async joinRoom(roomId: string, userId: string) {
    // WebRTC / LiveKit logic
    return { success: true, roomId };
  }
}