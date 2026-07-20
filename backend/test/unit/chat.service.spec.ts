import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ChatService } from '../../src/modules/chat/chat.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('ChatService', () => {
  let service: ChatService;
  const prisma = {
    booking: { findUnique: jest.fn() },
    message: {
      findMany: jest.fn(),
      count: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ChatService(prisma as unknown as PrismaService);
  });

  it('resolves teacher as counterpart for parent sender', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'b1',
      parentId: 'parent-1',
      teacher: { userId: 'teacher-user-1' },
    });

    const result = await service.resolveCounterpart('b1', 'parent-1');
    expect(result.receiverId).toBe('teacher-user-1');
  });

  it('resolves parent as counterpart for teacher sender', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'b1',
      parentId: 'parent-1',
      teacher: { userId: 'teacher-user-1' },
    });

    const result = await service.resolveCounterpart('b1', 'teacher-user-1');
    expect(result.receiverId).toBe('parent-1');
  });

  it('rejects outsiders', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'b1',
      parentId: 'parent-1',
      teacher: { userId: 'teacher-user-1' },
    });

    await expect(service.resolveCounterpart('b1', 'stranger')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('throws when booking missing', async () => {
    prisma.booking.findUnique.mockResolvedValue(null);
    await expect(service.resolveCounterpart('missing', 'parent-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('returns history for a participant', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'b1',
      parentId: 'parent-1',
      teacher: { userId: 'teacher-user-1' },
    });
    prisma.message.findMany.mockResolvedValue([
      {
        id: 'm1',
        bookingId: 'b1',
        senderId: 'teacher-user-1',
        receiverId: 'parent-1',
        message: 'Hello',
        createdAt: new Date('2026-07-20T10:00:00Z'),
        isRead: false,
        attachmentUrl: null,
      },
    ]);
    prisma.message.count.mockResolvedValue(1);
    prisma.message.updateMany.mockResolvedValue({ count: 1 });

    const result = await service.getHistory({
      userId: 'parent-1',
      bookingId: 'b1',
      page: 1,
      limit: 20,
    });

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].message).toBe('Hello');
    expect(result.bookingId).toBe('b1');
  });
});
