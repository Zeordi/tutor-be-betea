import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { APP_GUARD } from '@nestjs/core';
import { ChatController } from '../../src/modules/chat/chat.controller';
import { ChatService } from '../../src/modules/chat/chat.service';

describe('ChatController (e2e)', () => {
  let app: INestApplication;
  const chatService = {
    getHistory: jest.fn().mockResolvedValue({
      bookingId: 'b1',
      messages: [{ id: 'm1', senderId: 'u2', message: 'Hi', isRead: true }],
      total: 1,
      page: 1,
      totalPages: 1,
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        { provide: ChatService, useValue: chatService },
        {
          provide: APP_GUARD,
          useValue: {
            canActivate: (ctx: { switchToHttp: () => { getRequest: () => unknown } }) => {
              const req = ctx.switchToHttp().getRequest() as {
                user?: { id: string; userType: string };
              };
              req.user = { id: 'u1', userType: 'PARENT' };
              return true;
            },
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/chat/history returns booking-threaded messages', async () => {
    await request(app.getHttpServer())
      .get('/api/chat/history')
      .query({ bookingId: 'b1', page: 1, limit: 20 })
      .expect(200);

    expect(chatService.getHistory).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1', bookingId: 'b1' }),
    );
  });
});
