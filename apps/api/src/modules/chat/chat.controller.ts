import { Controller, Get, Post, Param, Body, UseGuards, BadRequestException } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { AntiPoachingService } from "./anti-poaching.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { SendMessageDto } from "./dto/send-message.dto";

@Controller("chat")
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly antiPoachingService: AntiPoachingService,
  ) {}

  @Get("conversations")
  @UseGuards(JwtAuthGuard, RolesGuard)
  conversations(@CurrentUser() user: any) {
    return this.chatService.getConversations(user.id);
  }

  @Get(":roomId/messages")
  @UseGuards(JwtAuthGuard, RolesGuard)
  getMessages(@Param("roomId") roomId: string) {
    return this.chatService.getMessages(roomId);
  }

  @Post(":roomId/messages")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async sendMessage(
    @Param("roomId") roomId: string,
    @CurrentUser() user: any,
    @Body() body: SendMessageDto,
  ) {
    const saved = await this.chatService.sendMessage(roomId, user.id, body.content);
    if (saved.originalBlocked) {
      throw new BadRequestException("Message contains restricted contact information");
    }
    return saved;
  }
}
