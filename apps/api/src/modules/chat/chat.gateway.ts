import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { AntiPoachingService } from "./anti-poaching.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly antiPoachingService: AntiPoachingService,
  ) {}

  handleConnection(client: Socket) {
    // Optional: auth checks can be added here later
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage("join_room")
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    client.join(roomId);
    return { event: "joined_room", roomId };
  }

  @SubscribeMessage("send_message")
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    body: {
      roomId: string;
      senderId: string;
      content: string;
    },
  ) {
    const { roomId, senderId, content } = body;

    if (!roomId || !senderId || !content?.trim()) {
      return { error: "Invalid message payload" };
    }

    // 1) Anti-poaching scan + sanitize
    const scan = this.antiPoachingService.sanitize(content);
    const sanitizedContent = scan.sanitizedText;
    const blocked = scan.blocked;

    // 2) Save message to database
    const saved = await this.chatService.saveMessage({
      roomId,
      senderId,
      content: sanitizedContent,
      originalBlocked: blocked,
    });

    // 3) Broadcast to room
    const payload = {
      id: saved.id,
      roomId: saved.roomId,
      senderId: saved.senderId,
      content: saved.content,
      originalBlocked: saved.originalBlocked,
      createdAt: saved.createdAt,
    };

    this.server.to(roomId).emit("new_message", payload);

    return payload;
  }
}