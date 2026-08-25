import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { VaultService } from "./vault.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { Request } from "express";

@Controller("vault")
@UseGuards(JwtAuthGuard, RolesGuard)
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  @Post("upload")
  @Roles("TEACHER", "SUPER_ADMIN")
  @UseInterceptors(FileInterceptor("file"))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { documentType: string; teacherId?: string },
    @CurrentUser() user: any,
  ) {
    const teacherId = user.role === "TEACHER" ? user.id : body.teacherId;

    return this.vaultService.uploadDocument({
      teacherId: teacherId!,
      documentType: body.documentType as any,
      fileBuffer: file.buffer,
      uploadedBy: user.id,
      mimeType: file.mimetype,
    });
  }

  @Get(":id/decrypt")
  @Roles("SUPER_ADMIN")
  async decrypt(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Req() req: Request,
  ) {
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
    return this.vaultService.getDecryptedDocument(id, user.id, ip);
  }

  @Get("teacher/:teacherId")
  @Roles("SUPER_ADMIN", "TEACHER")
  async listDocuments(@Param("teacherId") teacherId: string, @CurrentUser() user: any) {
    if (user.role === "TEACHER" && user.id !== teacherId) {
      throw new ForbiddenException();
    }
    return this.vaultService.listTeacherDocuments(teacherId);
  }
}