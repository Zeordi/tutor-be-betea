import { Injectable } from '@nestjs/common';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  private items: Array<NotificationDto & { id: string; read: boolean }> = [];

  list() {
    return this.items;
  }

  create(dto: NotificationDto) {
    const item = { id: crypto.randomUUID(), read: false, ...dto };
    this.items.push(item);
    return item;
  }

  markAllRead() {
    this.items.forEach((i) => (i.read = true));
    return { updated: this.items.length };
  }
}
