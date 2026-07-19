import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('teacher/:teacherId')
  forTeacher(@Param('teacherId') teacherId: string) {
    return this.reviewsService.forTeacher(teacherId);
  }

  @Post()
  create(@Req() req: { user?: { id: string } }, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(req.user?.id || '', dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(id, dto);
  }
}
