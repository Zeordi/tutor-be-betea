import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: any, @Query("type") type?: string) {
    return this.notificationsService.getUserNotifications(user.id, type);
  }

  @Post(":id/read")
  markRead(@CurrentUser() user: any, @Param("id") id: string) {
    return this.notificationsService.markRead(user.id, id);
  }

  @Post("read-all")
  markAllRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllRead(user.id);
  }
}