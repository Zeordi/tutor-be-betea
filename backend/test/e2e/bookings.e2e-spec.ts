import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { BookingsController } from '../../src/modules/bookings/bookings.controller';
import { BookingsService } from '../../src/modules/bookings/bookings.service';
import { APP_GUARD } from '@nestjs/core';

describe('BookingsController (e2e)', () => {
  let app: INestApplication;
  const bookingsService = {
    createBooking: jest.fn().mockResolvedValue({ id: 'b1', status: 'PENDING' }),
    confirmBooking: jest.fn().mockResolvedValue({ id: 'b1', status: 'CONFIRMED' }),
    completeBooking: jest.fn().mockResolvedValue({ id: 'b1', status: 'COMPLETED' }),
    cancelBooking: jest.fn().mockResolvedValue({ id: 'b1', status: 'CANCELLED' }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        { provide: BookingsService, useValue: bookingsService },
        {
          provide: APP_GUARD,
          useValue: {
            canActivate: (ctx: { switchToHttp: () => { getRequest: () => unknown } }) => {
              const req = ctx.switchToHttp().getRequest() as {
                user?: { id: string; userType: string; teacherProfile?: { id: string } };
              };
              req.user = {
                id: 'u1',
                userType: 'PARENT',
                teacherProfile: { id: 't1' },
              };
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

  it('POST /api/bookings creates booking for current user', async () => {
    await request(app.getHttpServer())
      .post('/api/bookings')
      .send({
        teacherId: 't1',
        studentName: 'Kid',
        studentAge: 10,
        bookingDate: '2026-07-20',
        startTime: '10:00',
        endTime: '11:00',
      })
      .expect(201);

    expect(bookingsService.createBooking).toHaveBeenCalledWith(
      'u1',
      expect.objectContaining({ teacherId: 't1' }),
    );
  });
});
