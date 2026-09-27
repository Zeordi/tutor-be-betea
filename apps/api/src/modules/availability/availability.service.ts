import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class AvailabilityService {
  async ensureTeacherProfile(teacherId: string) {
    const existing = await prisma.teacherProfile.findUnique({
      where: { userId: teacherId },
    });
    if (existing) return existing;

    const user = await prisma.user.findUnique({ where: { id: teacherId } });
    if (!user || user.role !== "TEACHER") {
      throw new NotFoundException("Teacher profile not found");
    }

    return prisma.teacherProfile.create({
      data: {
        userId: teacherId,
        bio: null,
        bioAm: null,
        hourlyRate: 0,
        monthlyRate: 0,
        weekendRate: null,
        subjects: [],
        grades: [],
        maxTravelKm: 5,
        teachingStyles: [],
        isAvailable: false,
        payoutMethod: null,
        payoutAccount: null,
        onboardingStep: 0,
      },
    });
  }

  async getMine(teacherId: string) {
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: teacherId },
      include: { availability: true, packages: true },
    });

    if (!profile) {
      await this.ensureTeacherProfile(teacherId);
      return {
        availability: [],
        packages: [],
        payoutMethod: null,
        payoutAccount: null,
      };
    }

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
    await this.ensureTeacherProfile(teacherId);
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
    await this.ensureTeacherProfile(teacherId);
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