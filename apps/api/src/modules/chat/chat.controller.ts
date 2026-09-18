import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { AntiPoachingService } from "./anti-poaching.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("chat")
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly antiPoachingService: AntiPoachingService,
  ) {}

  @Get(":roomId/messages")
  @UseGuards(JwtAuthGuard, RolesGuard)
  getMessages(@Param("roomId") roomId: string) {
    return this.chatService.getMessages(roomId);
  }

  @Post(":roomId/messages")
  @UseGuards(JwtAuthGuard, RolesGuard)
  sendMessage(
    @Param("roomId") roomId: string,
    @CurrentUser() user: any,
    @Body() body: { content: string },
  ) {
    const scan = this.antiPoachingService.sanitize(body.content || "");
    return this.chatService.sendMessage({
      roomId,
      senderId: user.id,
      content: scan.sanitizedText,
      originalBlocked: scan.blocked,
    });
  }
}