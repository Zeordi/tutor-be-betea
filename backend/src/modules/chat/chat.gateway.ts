import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({ namespace: '/chat', cors: { origin: true } })
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('message')
  handleMessage(@MessageBody() dto: SendMessageDto, @ConnectedSocket() client: Socket) {
    const saved = this.chatService.send(dto);
    this.server.to(dto.conversationId).emit('message', saved);
    client.join(dto.conversationId);
    return saved;
  }
}
