import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../prisma/prisma.service';
import { S3Service } from '../../../services/s3.service';
import { VerificationDto } from './dto/verification.dto';
import { UploadUrlDto } from './dto/upload-url.dto';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class VerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  private async resolveTeacher(userId: string) {
    const profile = await this.prisma.teacherProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Teacher profile not found');
    return profile;
  }

  async getStatus(userId: string) {
    const profile = await this.resolveTeacher(userId);
    const latest = await this.prisma.verificationLog.findFirst({
      where: { teacherId: profile.id },
      orderBy: { createdAt: 'desc' },
    });

    return {
      status: profile.verificationStatus,
      latestLog: latest,
      uploadsConfigured: this.s3.isConfigured(),
    };
  }

  async createUploadUrl(userId: string, dto: UploadUrlDto) {
    const profile = await this.resolveTeacher(userId);
    const safeName = dto.fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
    const key = `verifications/${profile.id}/${randomUUID()}-${safeName}`;
    return this.s3.createPresignedUpload({
      key,
      contentType: dto.contentType,
    });
  }

  async submit(userId: string, dto: VerificationDto) {
    const profile = await this.resolveTeacher(userId);
    const documentUrls = dto.documentUrls?.length
      ? dto.documentUrls
      : dto.documentUrl
        ? [dto.documentUrl]
        : [];

    if (!documentUrls.length) {
      throw new BadRequestException('Upload at least one verification document');
    }

    const log = await this.prisma.verificationLog.create({
      data: {
        teacherId: profile.id,
        verificationType: dto.verificationType || 'ID',
        status: VerificationStatus.PENDING,
        documentUrls,
      },
    });

    await this.prisma.teacherProfile.update({
      where: { id: profile.id },
      data: { verificationStatus: VerificationStatus.PENDING },
    });

    return {
      status: VerificationStatus.PENDING,
      log,
    };
  }
}
