import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class AvailabilityService {
  async getMine(teacherId: string) {
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: teacherId },
      include: { availability: true, packages: true },
    });
    if (!profile) throw new NotFoundException("Teacher profile not found");
    return {
      availability: profile.availability,
      packages: profile.packages,
      payoutMethod: profile.payoutMethod,
      payoutAccount: profile.payoutAccount,
    };
  }

  async setSlots(
    teacherId: string,
    slots: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      active?: boolean;
      blockedDates?: string[];
    }>,
  ) {
    await prisma.teacherAvailability.deleteMany({ where: { teacherId } });
    if (!slots?.length) return [];
    await prisma.teacherAvailability.createMany({
      data: slots.map((s) => ({
        teacherId,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        active: s.active ?? true,
        blockedDates: s.blockedDates || [],
      })),
    });
    return prisma.teacherAvailability.findMany({ where: { teacherId } });
  }

  async upsertPackage(
    teacherId: string,
    data: {
      id?: string;
      name: string;
      sessions: number;
      priceEtb: number;
      description?: string;
      active?: boolean;
    },
  ) {
    if (data.id) {
      return prisma.teacherPackage.update({
        where: { id: data.id },
        data: {
          name: data.name,
          sessions: data.sessions,
          priceEtb: data.priceEtb,
          description: data.description,
          active: data.active ?? true,
        },
      });
    }
    return prisma.teacherPackage.create({
      data: {
        teacherId,
        name: data.name,
        sessions: data.sessions,
        priceEtb: data.priceEtb,
        description: data.description,
        active: data.active ?? true,
      },
    });
  }
}