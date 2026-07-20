import { BadRequestException } from '@nestjs/common';
import { BookingsService } from '../../src/modules/bookings/bookings.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { StripeService } from '../../src/services/stripe.service';
import { NotificationService } from '../../src/services/notification.service';

describe('BookingsService', () => {
  let service: BookingsService;
  const prisma = {
    teacherProfile: { findUnique: jest.fn(), update: jest.fn() },
    booking: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    availability: { findFirst: jest.fn(), findMany: jest.fn() },
    payment: { create: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
  };
  const stripeService = {
    createPaymentIntent: jest.fn(),
    releasePayment: jest.fn(),
    refundPayment: jest.fn(),
  };
  const notificationService = {
    sendBookingRequestNotification: jest.fn(),
    sendBookingConfirmedNotification: jest.fn(),
    sendLessonCompletedNotification: jest.fn(),
    sendBookingCancelledNotification: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BookingsService(
      prisma as unknown as PrismaService,
      stripeService as unknown as StripeService,
      notificationService as unknown as NotificationService,
    );
  });

  it('creates a booking when teacher is available', async () => {
    prisma.teacherProfile.findUnique.mockResolvedValue({
      id: 't1',
      hourlyRate: 40,
      userId: 'teacher-user',
      verificationStatus: 'APPROVED',
      isAvailable: true,
      user: { fullName: 'Teacher' },
    });
    prisma.booking.create.mockResolvedValue({
      id: 'b1',
      teacherId: 't1',
      parentId: 'p1',
      totalAmount: 40,
    });

    jest.spyOn(service as never, 'checkAvailability' as never).mockResolvedValue(true as never);

    const result = await service.createBooking('p1', {
      teacherId: 't1',
      studentName: 'Kid',
      studentAge: 10,
      bookingDate: '2026-07-20',
      startTime: '10:00',
      endTime: '11:00',
      learningGoals: 'Math',
    } as never);

    expect(result.id).toBe('b1');
    expect(notificationService.sendBookingRequestNotification).toHaveBeenCalledWith(
      expect.objectContaining({ bookingId: 'b1', teacherId: 't1', parentId: 'p1' }),
    );
  });

  it('teacher accept keeps booking PENDING and returns clientSecret', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'b1',
      teacherId: 't1',
      parentId: 'p1',
      status: 'PENDING',
      totalAmount: 40,
      teacher: { user: { fullName: 'Teacher' } },
    });
    stripeService.createPaymentIntent.mockResolvedValue({
      id: 'pi_1',
      client_secret: 'pi_1_secret',
    });
    prisma.payment.findFirst.mockResolvedValue(null);
    prisma.payment.create.mockResolvedValue({ id: 'pay1' });

    const result = await service.confirmBooking('b1', 't1');

    expect(result.booking.status).toBe('PENDING');
    expect(result.clientSecret).toBe('pi_1_secret');
    expect(result.stripePaymentIntent).toBe('pi_1');
    expect(prisma.booking.update).not.toHaveBeenCalled();
    expect(stripeService.createPaymentIntent).toHaveBeenCalledWith(
      expect.objectContaining({ bookingId: 'b1', parentId: 'p1', amount: 40 }),
    );
    expect(prisma.payment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          bookingId: 'b1',
          stripePaymentIntent: 'pi_1',
          status: 'PENDING',
        }),
      }),
    );
    expect(notificationService.sendBookingConfirmedNotification).not.toHaveBeenCalled();
  });

  it('teacher re-accept updates existing PENDING payment with a new intent', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'b1',
      teacherId: 't1',
      parentId: 'p1',
      status: 'PENDING',
      totalAmount: 40,
      teacher: { user: { fullName: 'Teacher' } },
    });
    stripeService.createPaymentIntent.mockResolvedValue({
      id: 'pi_2',
      client_secret: 'pi_2_secret',
    });
    prisma.payment.findFirst.mockResolvedValue({ id: 'pay1', status: 'PENDING' });
    prisma.payment.update.mockResolvedValue({ id: 'pay1' });

    const result = await service.confirmBooking('b1', 't1');

    expect(result.clientSecret).toBe('pi_2_secret');
    expect(prisma.payment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'pay1' },
        data: expect.objectContaining({ stripePaymentIntent: 'pi_2', status: 'PENDING' }),
      }),
    );
    expect(prisma.payment.create).not.toHaveBeenCalled();
  });

  it('rejects confirm when booking is already CONFIRMED', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'b1',
      teacherId: 't1',
      status: 'CONFIRMED',
      teacher: { user: { fullName: 'Teacher' } },
    });

    await expect(service.confirmBooking('b1', 't1')).rejects.toBeInstanceOf(BadRequestException);
    expect(stripeService.createPaymentIntent).not.toHaveBeenCalled();
  });

  it('completeBooking requires SUCCEEDED payment', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'b1',
      teacherId: 't1',
      parentId: 'p1',
      status: 'CONFIRMED',
      teacherPayout: 34,
    });
    prisma.payment.findFirst.mockResolvedValue(null);

    await expect(service.completeBooking('b1', 't1')).rejects.toBeInstanceOf(BadRequestException);
    expect(stripeService.releasePayment).not.toHaveBeenCalled();
  });
});
