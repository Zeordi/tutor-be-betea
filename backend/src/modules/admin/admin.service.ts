import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DisputeStatus, PaymentStatus, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeService } from '../../services/stripe.service';
import { DisputeResolution, DisputeResolutionDto } from './dto/dispute-resolution.dto';
import { UserManagementDto } from './dto/user-management.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  listUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        userType: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        teacherProfile: {
          select: {
            id: true,
            verificationStatus: true,
            avgRating: true,
            hourlyRate: true,
          },
        },
      },
    });
  }

  listVerifications() {
    return this.prisma.verificationLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        teacher: {
          include: {
            user: {
              select: { id: true, fullName: true, email: true, phone: true },
            },
          },
        },
      },
    });
  }

  listDisputes() {
    return this.prisma.dispute.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        booking: true,
        raisedByUser: {
          select: { id: true, fullName: true, email: true },
        },
        resolvedByUser: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });
  }

  async manageUser(dto: UserManagementDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id: dto.userId },
      data: {
        ...(dto.disabled != null ? { isActive: !dto.disabled } : {}),
        ...(dto.emailVerified != null ? { isVerified: dto.emailVerified } : {}),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        userType: true,
        isVerified: true,
        isActive: true,
      },
    });

    if (dto.approveVerification && user.userType === 'TEACHER') {
      const profile = await this.prisma.teacherProfile.findUnique({
        where: { userId: user.id },
      });
      if (profile) {
        await this.prisma.teacherProfile.update({
          where: { id: profile.id },
          data: { verificationStatus: VerificationStatus.APPROVED },
        });
        await this.prisma.verificationLog.updateMany({
          where: { teacherId: profile.id, status: VerificationStatus.PENDING },
          data: {
            status: VerificationStatus.APPROVED,
            reviewedBy: 'ADMIN',
            reviewNotes: 'Approved by admin',
          },
        });
      }
    }

    return { updated: true, user: updated };
  }

  async resolveDispute(adminId: string, dto: DisputeResolutionDto) {
    const dispute = await this.prisma.dispute.findFirst({
      where: {
        bookingId: dto.bookingId,
        status: { in: [DisputeStatus.OPEN, DisputeStatus.UNDER_REVIEW] },
      },
      include: { booking: { include: { payments: true } } },
      orderBy: { createdAt: 'desc' },
    });

    if (!dispute) {
      throw new NotFoundException('Open dispute not found for booking');
    }

    const payment =
      dispute.booking.payments[0] ||
      (await this.prisma.payment.findFirst({ where: { bookingId: dto.bookingId } }));

    let status: DisputeStatus = DisputeStatus.RESOLVED;
    if (dto.resolution === DisputeResolution.REFUND || dto.resolution === DisputeResolution.PARTIAL) {
      if (!payment) throw new BadRequestException('No payment found to refund');
      await this.stripeService.refundPayment(payment.stripePaymentIntent);
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.REFUNDED,
          refundAmount:
            dto.resolution === DisputeResolution.PARTIAL && dto.refundAmount != null
              ? dto.refundAmount
              : payment.amount,
        },
      });
      status = DisputeStatus.REFUNDED;
    }

    const updated = await this.prisma.dispute.update({
      where: { id: dispute.id },
      data: {
        status,
        resolvedBy: adminId,
        resolution: dto.resolution,
        resolutionDetails: dto.notes,
        resolvedAt: new Date(),
      },
    });

    await this.prisma.booking.update({
      where: { id: dto.bookingId },
      data: {
        status: status === DisputeStatus.REFUNDED ? 'CANCELLED' : 'COMPLETED',
      },
    });

    return { resolved: true, dispute: updated };
  }
}
