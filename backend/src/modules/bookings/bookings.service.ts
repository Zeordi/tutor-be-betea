// src/modules/bookings/bookings.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeService } from '../../services/stripe.service';
import { NotificationService } from '../../services/notification.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly notificationService: NotificationService,
  ) {}

  async createBooking(parentId: string, createBookingDto: CreateBookingDto) {
    const { teacherId, bookingDate, startTime, endTime, studentName, studentAge, learningGoals, isTrialLesson } = createBookingDto;

    // Check teacher exists and is available
    const teacher = await this.prisma.teacherProfile.findUnique({
      where: { id: teacherId },
      include: { user: true },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (teacher.verificationStatus !== 'APPROVED') {
      throw new BadRequestException('Teacher is not verified');
    }

    if (!teacher.isAvailable) {
      throw new BadRequestException('Teacher is currently unavailable');
    }

    // Check availability
    const isAvailable = await this.checkAvailability(teacherId, bookingDate, startTime, endTime);
    if (!isAvailable) {
      throw new BadRequestException('Teacher is not available at this time');
    }

    // Calculate duration and amount
    const durationHours = this.calculateDuration(startTime, endTime);
    const hourlyRate = Number(teacher.hourlyRate);
    const totalAmount = parseFloat((hourlyRate * durationHours).toFixed(2));
    const platformFee = parseFloat((totalAmount * 0.15).toFixed(2));
    const teacherPayout = parseFloat((totalAmount - platformFee).toFixed(2));

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        teacherId,
        parentId,
        studentName,
        studentAge,
        learningGoals,
        bookingDate: new Date(bookingDate),
        startTime,
        endTime,
        durationHours,
        totalAmount,
        platformFee,
        teacherPayout,
        isTrialLesson: isTrialLesson || false,
        status: BookingStatus.PENDING,
      },
    });

    // Send notifications
    await this.notificationService.sendBookingRequestNotification({
      bookingId: booking.id,
      teacherId,
      parentId,
    });

    return booking;
  }

  async confirmBooking(bookingId: string, teacherId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { teacher: { include: { user: true } }, parent: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.teacherId !== teacherId) {
      throw new BadRequestException('Not authorized to confirm this booking');
    }

    // Accept only while unpaid/pending. Payment webhook moves booking to CONFIRMED.
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Booking is not awaiting teacher acceptance / payment');
    }

    const paymentIntent = await this.stripeService.createPaymentIntent({
      amount: Number(booking.totalAmount),
      bookingId: booking.id,
      parentId: booking.parentId,
      description: `Tutoring session with ${booking.teacher.user.fullName}`,
    });

    const existingPayment = await this.prisma.payment.findFirst({
      where: { bookingId: booking.id, status: { in: ['PENDING', 'FAILED'] } },
      orderBy: { createdAt: 'desc' },
    });

    if (existingPayment) {
      await this.prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          stripePaymentIntent: paymentIntent.id,
          amount: booking.totalAmount,
          paymentMethod: 'CARD',
          status: 'PENDING',
        },
      });
    } else {
      await this.prisma.payment.create({
        data: {
          bookingId: booking.id,
          stripePaymentIntent: paymentIntent.id,
          amount: booking.totalAmount,
          paymentMethod: 'CARD',
          status: 'PENDING',
        },
      });
    }

    // Booking stays PENDING until Stripe webhook confirms payment.
    return {
      booking,
      clientSecret: paymentIntent.client_secret,
      stripePaymentIntent: paymentIntent.id,
      message: 'Teacher accepted. Parent must complete payment to confirm the booking.',
    };
  }

  async completeBooking(bookingId: string, teacherId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.teacherId !== teacherId) {
      throw new BadRequestException('Not authorized to complete this booking');
    }

    if (booking.status !== 'CONFIRMED' && booking.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Booking cannot be completed');
    }

    const paid = await this.prisma.payment.findFirst({
      where: { bookingId, status: 'SUCCEEDED' },
    });
    if (!paid) {
      throw new BadRequestException('Cannot complete booking before payment succeeds');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    await this.stripeService.releasePayment({
      bookingId: booking.id,
      amount: Number(booking.teacherPayout),
      teacherId: booking.teacherId,
    });

    await this.prisma.teacherProfile.update({
      where: { id: booking.teacherId },
      data: {
        totalStudents: { increment: 1 },
        totalEarnings: { increment: booking.teacherPayout },
      },
    });

    await this.notificationService.sendLessonCompletedNotification({
      bookingId: booking.id,
      teacherId,
      parentId: booking.parentId,
    });

    return updatedBooking;
  }

  async cancelBooking(bookingId: string, userId: string, reason: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { teacher: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.parentId !== userId && booking.teacher.userId !== userId) {
      throw new BadRequestException('Not authorized to cancel this booking');
    }

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking cannot be cancelled');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        cancellationReason: reason,
        cancelledAt: new Date(),
      },
    });

    // Process refund if payment was made
    const payment = await this.prisma.payment.findFirst({
      where: { bookingId, status: 'SUCCEEDED' },
    });

    if (payment) {
      await this.stripeService.refundPayment(payment.stripePaymentIntent);
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'REFUNDED' },
      });
    }

    await this.notificationService.sendBookingCancelledNotification({
      bookingId: booking.id,
      teacherId: booking.teacherId,
      parentId: booking.parentId,
      reason,
    });

    return updatedBooking;
  }

  private async checkAvailability(teacherId: string, date: string | Date, startTime: string, endTime: string): Promise<boolean> {
    const dayOfWeek = new Date(date).getDay();

    // Check teacher availability
    const availability = await this.prisma.availability.findFirst({
      where: {
        teacherId,
        dayOfWeek,
        isRecurring: true,
        startTime: { lte: startTime },
        endTime: { gte: endTime },
      },
    });

    if (!availability) {
      return false;
    }

    // Check for overlapping bookings
    const overlappingBookings = await this.prisma.booking.findMany({
      where: {
        teacherId,
        bookingDate: new Date(date),
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS],
        },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
      },
    });

    return overlappingBookings.length === 0;
  }

  private calculateDuration(startTime: string, endTime: string): number {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    return parseFloat(((endHour - startHour) + (endMinute - startMinute) / 60).toFixed(1));
  }
}
