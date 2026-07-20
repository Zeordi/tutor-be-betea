import { NotFoundException } from '@nestjs/common';
import { FavoritesService } from '../../src/modules/favorites/favorites.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { VerificationStatus } from '@prisma/client';

describe('FavoritesService', () => {
  let service: FavoritesService;
  const prisma = {
    favorite: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    teacherProfile: { findUnique: jest.fn() },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FavoritesService(prisma as unknown as PrismaService);
  });

  it('lists favorites for a parent', async () => {
    prisma.favorite.findMany.mockResolvedValue([
      {
        id: 'f1',
        teacherId: 't1',
        createdAt: new Date('2026-07-20'),
        teacher: {
          id: 't1',
          subjects: ['Math'],
          avgRating: 4.5,
          totalReviews: 2,
          hourlyRate: 40,
          experienceYears: 3,
          verificationStatus: VerificationStatus.APPROVED,
          isAvailable: true,
          user: { fullName: 'Ada', profileImage: null },
          availability: [{ dayOfWeek: 1 }],
        },
      },
    ]);

    const result = await service.list('p1');
    expect(result).toHaveLength(1);
    expect(result[0].teacher.name).toBe('Ada');
  });

  it('adds a favorite', async () => {
    prisma.teacherProfile.findUnique.mockResolvedValue({ id: 't1' });
    prisma.favorite.create.mockResolvedValue({
      id: 'f1',
      teacherId: 't1',
      createdAt: new Date(),
    });

    const result = await service.add('p1', 't1');
    expect(result.teacherId).toBe('t1');
  });

  it('throws when teacher missing', async () => {
    prisma.teacherProfile.findUnique.mockResolvedValue(null);
    await expect(service.add('p1', 'missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('removes a favorite', async () => {
    prisma.favorite.findUnique.mockResolvedValue({ id: 'f1' });
    prisma.favorite.delete.mockResolvedValue({});
    const result = await service.remove('p1', 't1');
    expect(result.success).toBe(true);
  });
});
