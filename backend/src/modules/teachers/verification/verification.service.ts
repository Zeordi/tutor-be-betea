import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { VerificationDto } from './dto/verification.dto';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class VerificationService {
  constructor(private readonly prisma: PrismaService) {}

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
    };
  }

  async submit(userId: string, dto: VerificationDto) {
    const profile = await this.resolveTeacher(userId);
    const documentUrls = dto.documentUrls?.length
      ? dto.documentUrls
      : dto.documentUrl
        ? [dto.documentUrl]
        : [];

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
