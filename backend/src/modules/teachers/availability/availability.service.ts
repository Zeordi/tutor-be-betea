import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AvailabilityDto } from './dto/availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveTeacherId(userId: string) {
    const profile = await this.prisma.teacherProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Teacher profile not found');
    return profile.id;
  }

  async list(userId: string) {
    const teacherId = await this.resolveTeacherId(userId);
    return this.prisma.availability.findMany({
      where: { teacherId },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async set(userId: string, dto: AvailabilityDto) {
    const teacherId = await this.resolveTeacherId(userId);

    for (const slot of dto.slots) {
      if (slot.startTime >= slot.endTime) {
        throw new BadRequestException('startTime must be before endTime');
      }
    }

    await this.prisma.$transaction([
      this.prisma.availability.deleteMany({ where: { teacherId } }),
      this.prisma.availability.createMany({
        data: dto.slots.map((slot) => ({
          teacherId,
          dayOfWeek: slot.dayOfWeek ?? slot.weekday ?? 0,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isRecurring: true,
        })),
      }),
    ]);

    return this.list(userId);
  }
}
