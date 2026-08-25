import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("chat")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Get chat message history for a room
   * GET /chat/:roomId/messages
   */
  @Get(":roomId/messages")
  @Roles("PARENT", "TEACHER", "SUPER_ADMIN")
  getMessages(
    @Param("roomId") roomId: string,
    @Query("limit") limit?: string,
  ) {
    const parsedLimit = limit ? Number(limit) : 50;
    return this.chatService.getMessages(roomId, parsedLimit);
  }
}