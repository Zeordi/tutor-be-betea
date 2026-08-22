import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AntiPoachingService } from "./anti-poaching.service";
import { ChatService } from "./chat.service";

@WebSocketGateway({
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly antiPoaching: AntiPoachingService,
    private readonly chatService: ChatService,
  ) {}

  handleConnection(client: Socket) {
    // TODO: Authenticate socket connection with JWT
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage("join_room")
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
    client.join(roomId);
    return { event: "joined", roomId };
  }

  @SubscribeMessage("send_message")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; content: string; senderId: string },
  ) {
    // Apply Anti-Poaching Shield
    const sanitizedContent = this.antiPoaching.sanitize(data.content);

    const message = {
      roomId: data.roomId,
      senderId: data.senderId,
      content: sanitizedContent,
      originalBlocked: sanitizedContent !== data.content,
      createdAt: new Date().toISOString(),
    };

    // Save to database
    await this.chatService.saveMessage(message);

    // Broadcast to room
    this.server.to(data.roomId).emit("new_message", message);

    return message;
  }
}
