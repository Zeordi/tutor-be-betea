import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { VideoService } from "./video.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("video")
@UseGuards(JwtAuthGuard, RolesGuard)
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post("room")
  @Roles("TEACHER", "PARENT")
  createRoom(@Body() body: { contractId: string; sessionId: string }) {
    return this.videoService.createRoom(body.contractId, body.sessionId);
  }
}
