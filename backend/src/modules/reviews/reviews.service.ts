import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  private reviews: Array<CreateReviewDto & { id: string }> = [];

  forTeacher(teacherId: string) {
    return this.reviews.filter((r) => r.teacherId === teacherId);
  }

  create(dto: CreateReviewDto) {
    const review = { id: crypto.randomUUID(), ...dto };
    this.reviews.push(review);
    return review;
  }

  update(id: string, dto: UpdateReviewDto) {
    const review = this.reviews.find((r) => r.id === id);
    if (!review) return null;
    Object.assign(review, dto);
    return review;
  }
}
