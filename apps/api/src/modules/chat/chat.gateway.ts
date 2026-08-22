import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AntiPoachingService } from './anti-poaching.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly antiPoaching: AntiPoachingService) {}

  @SubscribeMessage('send_message')
  handleMessage(@MessageBody() data: { roomId: string; content: string }) {
    // Real-time Anti-Poaching Shield
    const sanitized = this.antiPoaching.sanitize(data.content);

    this.server.to(data.roomId).emit('new_message', {
      ...data,
      content: sanitized,
    });
  }
}
