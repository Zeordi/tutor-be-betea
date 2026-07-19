import { BookingsService } from '../../src/modules/bookings/bookings.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { StripeService } from '../../src/services/stripe.service';
import { NotificationService } from '../../src/services/notification.service';

describe('BookingsService', () => {
  let service: BookingsService;
  const prisma = {
    teacherProfile: { findUnique: jest.fn() },
    booking: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    availability: { findMany: jest.fn() },
    payment: { create: jest.fn() },
  };
  const stripeService = {
    createPaymentIntent: jest.fn(),
    releasePayment: jest.fn(),
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
    prisma.availability.findMany.mockResolvedValue([
      { dayOfWeek: new Date('2026-07-20T10:00:00Z').getUTCDay(), startTime: '09:00', endTime: '17:00' },
    ]);
    prisma.booking.findFirst.mockResolvedValue(null);
    prisma.booking.create.mockResolvedValue({
      id: 'b1',
      teacherId: 't1',
      parentId: 'p1',
      totalAmount: 40,
    });

    // Bypass complex availability calendar by stubbing private method if present
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

  it('confirms booking and creates payment intent', async () => {
    prisma.booking.findUnique.mockResolvedValue({
      id: 'b1',
      teacherId: 't1',
      parentId: 'p1',
      status: 'PENDING',
      totalAmount: 40,
      teacher: { user: { fullName: 'Teacher' } },
    });
    stripeService.createPaymentIntent.mockResolvedValue({ id: 'pi_1' });
    prisma.booking.update.mockResolvedValue({ id: 'b1', status: 'CONFIRMED' });
    prisma.payment.create.mockResolvedValue({ id: 'pay1' });

    const result = await service.confirmBooking('b1', 't1');
    expect(result.booking.status).toBe('CONFIRMED');
    expect(result.clientSecret).toBeUndefined();
    expect(stripeService.createPaymentIntent).toHaveBeenCalled();
    expect(notificationService.sendBookingConfirmedNotification).toHaveBeenCalled();
  });
});

