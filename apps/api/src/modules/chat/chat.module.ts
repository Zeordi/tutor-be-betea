import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AntiPoachingService } from './anti-poaching.service';
import { ChatController } from './chat.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, AntiPoachingService],
  exports: [ChatService],
})
export class ChatModule {}
