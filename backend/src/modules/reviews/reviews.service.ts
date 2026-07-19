import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  forTeacher(teacherId: string) {
    return this.prisma.review.findMany({
      where: { teacherId, isPublic: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(reviewerId: string, dto: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id: dto.bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');

    const review = await this.prisma.review.create({
      data: {
        bookingId: dto.bookingId,
        reviewerId,
        teacherId: booking.teacherId,
        rating: dto.rating,
        reviewText: dto.reviewText,
        isPublic: dto.isPublic ?? true,
      },
    });

    return {
      id: review.id,
      rating: review.rating,
      reviewText: review.reviewText,
      isPublic: review.isPublic,
      createdAt: review.createdAt,
    };
  }

  async update(id: string, dto: UpdateReviewDto) {
    return this.prisma.review.update({
      where: { id },
      data: {
        ...(dto.rating != null ? { rating: dto.rating } : {}),
        ...((dto as any).reviewText != null || (dto as any).comment != null
          ? { reviewText: (dto as any).reviewText ?? (dto as any).comment }
          : {}),
      },
    });
  }
}
