import { NotificationsService } from '../../src/modules/notifications/notifications.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotificationType } from '@prisma/client';

describe('NotificationsService', () => {
  let service: NotificationsService;
  const prisma = {
    notification: {
      findMany: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new NotificationsService(prisma as unknown as PrismaService);
  });

  it('lists notifications for a user', async () => {
    prisma.notification.findMany.mockResolvedValue([{ id: 'n1', userId: 'u1' }]);
    const result = await service.list('u1');
    expect(prisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'u1' } }),
    );
    expect(result).toHaveLength(1);
  });

  it('creates a system notification by default', async () => {
    prisma.notification.create.mockResolvedValue({ id: 'n1' });
    await service.create({
      userId: 'u1',
      title: 'Hello',
      message: 'World',
    });
    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: NotificationType.SYSTEM,
        title: 'Hello',
        message: 'World',
      }),
    });
  });

  it('marks all unread notifications as read', async () => {
    prisma.notification.updateMany.mockResolvedValue({ count: 2 });
    const result = await service.markAllRead('u1');
    expect(result.updated).toBe(2);
  });
});
