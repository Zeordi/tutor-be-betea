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
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import type { Request } from "express";
import { VaultService, VaultDocumentType } from "./vault.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

const ALLOWED_TYPES: VaultDocumentType[] = [
  "NATIONAL_ID",
  "PASSPORT",
  "DEGREE",
  "TRANSCRIPT",
  "LIVENESS_SELFIE",
];

@Controller("vault")
@UseGuards(JwtAuthGuard, RolesGuard)
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  @Post("upload")
  @Roles("TEACHER", "SUPER_ADMIN")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { documentType: string; teacherId?: string },
    @CurrentUser() user: any,
  ) {
    if (!file?.buffer) {
      throw new BadRequestException("file is required (multipart field name: file)");
    }
    if (!ALLOWED_TYPES.includes(body.documentType as VaultDocumentType)) {
      throw new BadRequestException(
        `documentType must be one of: ${ALLOWED_TYPES.join(", ")}`,
      );
    }

    const teacherId =
      user.role === "TEACHER" ? user.id : body.teacherId || user.id;

    return this.vaultService.uploadDocument({
      teacherId,
      documentType: body.documentType as VaultDocumentType,
      fileBuffer: file.buffer,
      uploadedBy: user.id,
      mimeType: file.mimetype,
    });
  }

  /** Metadata only — never returns ciphertext to clients */
  @Get("pending")
  @Roles("SUPER_ADMIN")
  listPending() {
    return this.vaultService.listPending();
  }

  @Get("teacher/:teacherId")
  @Roles("SUPER_ADMIN", "TEACHER")
  async listDocuments(
    @Param("teacherId") teacherId: string,
    @CurrentUser() user: any,
  ) {
    if (user.role === "TEACHER" && user.id !== teacherId) {
      throw new ForbiddenException();
    }
    return this.vaultService.listTeacherDocuments(teacherId);
  }

  @Get(":id/decrypt")
  @Roles("SUPER_ADMIN")
  async decrypt(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Req() req: Request,
  ) {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    return this.vaultService.getDecryptedDocument(id, user.id, ip);
  }
}