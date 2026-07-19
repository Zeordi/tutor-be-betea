import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  private messages: Array<SendMessageDto & { id: string; createdAt: string }> = [];

  send(dto: SendMessageDto) {
    const message = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...dto,
    };
    this.messages.push(message);
    return message;
  }

  list(conversationId: string) {
    return this.messages.filter((m) => m.conversationId === conversationId);
  }
}
