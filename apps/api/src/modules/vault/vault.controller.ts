import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  ForbiddenException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { VaultService } from "./vault.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import "multer";

@Controller("vault")
@UseGuards(JwtAuthGuard, RolesGuard)
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  /**
   * Teacher or Admin can upload documents
   */
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
      teacherId,
      documentType: body.documentType as any,
      fileBuffer: file.buffer,
      uploadedBy: user.id,
    });
  }

  /**
   * Only Super Admin can decrypt and view
   */
  @Get(":id/decrypt")
  @Roles("SUPER_ADMIN")
  async decrypt(@Param("id") id: string, @CurrentUser() user: any) {
    return this.vaultService.getDecryptedDocument(id, user.id);
  }

  /**
   * List documents metadata for a teacher
   */
  @Get("teacher/:teacherId")
  @Roles("SUPER_ADMIN", "TEACHER")
  async listDocuments(@Param("teacherId") teacherId: string, @CurrentUser() user: any) {
    if (user.role === "TEACHER" && user.id !== teacherId) {
      throw new ForbiddenException();
    }
    return this.vaultService.listTeacherDocuments(teacherId);
  }
}
