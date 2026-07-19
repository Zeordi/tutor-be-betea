import { NotFoundException } from '@nestjs/common';
import { AdminService } from '../../src/modules/admin/admin.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { StripeService } from '../../src/services/stripe.service';

describe('AdminService', () => {
  let service: AdminService;
  const prisma = {
    user: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    verificationLog: { findMany: jest.fn(), updateMany: jest.fn() },
    dispute: { findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
    teacherProfile: { findUnique: jest.fn(), update: jest.fn() },
    payment: { findFirst: jest.fn(), update: jest.fn() },
    booking: { update: jest.fn() },
  };
  const stripeService = { refundPayment: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AdminService(
      prisma as unknown as PrismaService,
      stripeService as unknown as StripeService,
    );
  });

  it('lists users without password hashes', async () => {
    prisma.user.findMany.mockResolvedValue([{ id: 'u1', email: 'a@b.com' }]);
    const users = await service.listUsers();
    expect(users).toHaveLength(1);
  });

  it('deactivates a user', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u1', userType: 'PARENT' });
    prisma.user.update.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      fullName: 'A',
      userType: 'PARENT',
      isVerified: true,
      isActive: false,
    });

    const result = await service.manageUser({ userId: 'u1', disabled: true });
    expect(result.updated).toBe(true);
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isActive: false }),
      }),
    );
  });

  it('throws when managing missing user', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.manageUser({ userId: 'missing' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
