import { Injectable } from "@nestjs/common";

@Injectable()
export class VideoService {
  /**
   * Create a video room for a session
   * Later integrate LiveKit / Daily.co / Agora
   */
  async createRoom(contractId: string, sessionId: string) {
    // TODO: Integrate with LiveKit or Daily.co
    return {
      roomId: `room_\( {contractId}_ \){sessionId}`,
      joinUrl: null,
      provider: "LIVEKIT",
      message: "Video provider not yet connected",
    };
  }

  async generateToken(roomId: string, userId: string, role: "teacher" | "student") {
    // TODO: Generate real provider token
    return {
      token: null,
      message: "Video provider not yet connected",
    };
  }
}
