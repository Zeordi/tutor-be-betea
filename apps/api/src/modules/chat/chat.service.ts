import { Injectable } from "@nestjs/common";
// import { prisma } from "@tutor/database";

@Injectable()
export class ChatService {
  async saveMessage(message: {
    roomId: string;
    senderId: string;
    content: string;
    originalBlocked: boolean;
    createdAt: string;
  }) {
    // TODO: Save to chat_messages table when schema is extended
    console.log("[CHAT]", message);
    return message;
  }

  async getMessages(roomId: string) {
    // TODO: Fetch from database
    return [];
  }
}
