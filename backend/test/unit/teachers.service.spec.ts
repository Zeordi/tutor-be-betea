import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TeachersService } from '../../src/modules/teachers/teachers.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { VerificationStatus } from '@prisma/client';

describe('TeachersService', () => {
  let service: TeachersService;
  const prisma = {
    teacherProfile: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    user: { findUnique: jest.fn() },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TeachersService(prisma as unknown as PrismaService);
  });

  it('searches approved available teachers', async () => {
    prisma.teacherProfile.findMany.mockResolvedValue([
      {
        id: 't1',
        subjects: ['Math'],
        avgRating: 4.5,
        totalReviews: 3,
        hourlyRate: 25,
        experienceYears: 5,
        verificationStatus: VerificationStatus.APPROVED,
        user: { fullName: 'Ada', profileImage: null },
        availability: [{ dayOfWeek: 1 }],
      },
    ]);

    const result = await service.search({ subject: 'math', page: 1, limit: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Ada');
    expect(result.total).toBe(1);
    expect(prisma.teacherProfile.count).not.toHaveBeenCalled();
  });

  it('creates a teacher profile for a user', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u1' });
    prisma.teacherProfile.findUnique.mockResolvedValue(null);
    prisma.teacherProfile.create.mockResolvedValue({ id: 't1', userId: 'u1' });

    const result = await service.create('u1', {
      subjects: ['Math'],
      hourlyRate: 20,
      experienceYears: 2,
    });
    expect(result.id).toBe('t1');
  });

  it('rejects duplicate teacher profile', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u1' });
    prisma.teacherProfile.findUnique.mockResolvedValue({ id: 't1' });
    await expect(
      service.create('u1', { subjects: ['Math'], hourlyRate: 20 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('updates teacher profile by user id', async () => {
    prisma.teacherProfile.findUnique
      .mockResolvedValueOnce({ id: 't1', userId: 'u1' })
      .mockResolvedValueOnce({ id: 't1', userId: 'u1' });
    prisma.teacherProfile.update.mockResolvedValue({ id: 't1', bio: 'Hello' });

    const result = await service.update('u1', { bio: 'Hello' });
    expect(result.bio).toBe('Hello');
  });

  it('throws when updating missing profile', async () => {
    prisma.teacherProfile.findUnique.mockResolvedValue(null);
    await expect(service.update('missing', { bio: 'x' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
