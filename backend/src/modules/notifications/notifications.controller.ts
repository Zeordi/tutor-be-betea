import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list() {
    return this.notificationsService.list();
  }

  @Post()
  create(@Body() dto: NotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Patch('read-all')
  readAll() {
    return this.notificationsService.markAllRead();
  }
}
