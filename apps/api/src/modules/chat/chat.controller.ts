import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

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
    @Body() body: any,
  ) {
    return this.chatService.sendMessage(roomId, user.id, body.content);
  }
}