import { Controller, Get, Query, Req } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('history')
  history(
    @Req() req: { user?: { id: string } },
    @Query('bookingId') bookingId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '50',
  ) {
    return this.chatService.getHistory({
      userId: req.user?.id || '',
      bookingId,
      page: Number(page) || 1,
      limit: Number(limit) || 50,
    });
  }
}
