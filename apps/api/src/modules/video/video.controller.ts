import { Controller, Post, Get, Param, UseGuards } from "@nestjs/common";
import { VideoService } from "./video.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("video")
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post(":contractId/room")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  createRoom(@Param("contractId") contractId: string, @CurrentUser() user: any) {
    return this.videoService.createRoom(contractId, user.id);
  }

  @Get(":roomId/join")
  @UseGuards(JwtAuthGuard, RolesGuard)
  joinRoom(@Param("roomId") roomId: string, @CurrentUser() user: any) {
    return this.videoService.joinRoom(roomId, user.id);
  }
}