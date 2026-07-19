import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationDto } from './dto/notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@Req() req: { user?: { id: string } }) {
    return this.notificationsService.list(req.user?.id || '');
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: NotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Patch('read-all')
  readAll(@Req() req: { user?: { id: string } }) {
    return this.notificationsService.markAllRead(req.user?.id || '');
  }

  @Patch(':id/read')
  markRead(@Req() req: { user?: { id: string } }, @Param('id') id: string) {
    return this.notificationsService.markRead(req.user?.id || '', id);
  }
}
