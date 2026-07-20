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
    listBookings: jest.fn().mockResolvedValue({
      data: [{ id: 'b1', status: 'PENDING' }],
      total: 1,
      page: 1,
      totalPages: 1,
    }),
    getBooking: jest.fn().mockResolvedValue({ id: 'b1', status: 'PENDING' }),
    confirmBooking: jest.fn().mockResolvedValue({
      booking: { id: 'b1', status: 'PENDING' },
      clientSecret: 'pi_secret',
      stripePaymentIntent: 'pi_1',
    }),
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

  it('GET /api/bookings lists bookings for current user', async () => {
    const res = await request(app.getHttpServer()).get('/api/bookings').expect(200);
    expect(res.body.data || res.body).toBeTruthy();
    expect(bookingsService.listBookings).toHaveBeenCalled();
  });

  it('GET /api/bookings/:id returns one booking', async () => {
    await request(app.getHttpServer()).get('/api/bookings/b1').expect(200);
    expect(bookingsService.getBooking).toHaveBeenCalledWith(
      'b1',
      expect.objectContaining({ id: 'u1' }),
    );
  });
});
