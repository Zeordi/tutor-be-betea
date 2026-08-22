import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AntiPoachingService } from './anti-poaching.service';

@Module({
  providers: [ChatGateway, ChatService, AntiPoachingService],
  exports: [ChatService],
})
export class ChatModule {}
