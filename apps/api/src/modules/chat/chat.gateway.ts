import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { redis } from "../../config/redis";
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
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    const token = (client.handshake.query?.token as string) || "";
    if (!token) {
      client.disconnect(true);
      return;
    }

    let payload: { sub: string; role: string; jti?: string };
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      client.disconnect(true);
      return;
    }

    if (payload.jti) {
      try {
        const revoked = await redis.get(`revoked_access:${payload.jti}`);
        if (revoked) {
          client.disconnect(true);
          return;
        }
      } catch {
        // Redis failure: fail open so a valid JWT is not rejected
      }
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || user.status === "BANNED" || user.status === "SUSPENDED") {
      client.disconnect(true);
      return;
    }

    client.data.user = { id: user.id, role: user.role };
  }

  @SubscribeMessage("join_room")
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    const user = client.data.user;
    if (!user) {
      client.disconnect(true);
      return { error: "Unauthorized" };
    }

    if (!(await this.chatService.isValidRoom(roomId, user.id))) {
      return { error: "Invalid room" };
    }

    client.join(roomId);
    return { event: "joined_room", roomId };
  }

  @SubscribeMessage("send_message")
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    body: {
      roomId: string;
      content: string;
    },
  ) {
    const user = client.data.user;
    if (!user) {
      return { error: "Unauthorized" };
    }

    const { roomId, content } = body;

    if (!roomId || !content?.trim()) {
      return { error: "Invalid message payload" };
    }

    if (!(await this.chatService.isValidRoom(roomId, user.id))) {
      return { error: "Invalid room" };
    }

    const saved = await this.chatService.sendMessage(roomId, user.id, content);

    if (saved.originalBlocked) {
      return { error: "Message contains restricted contact information" };
    }

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
