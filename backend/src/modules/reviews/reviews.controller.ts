import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get('teacher/:teacherId')
  forTeacher(@Param('teacherId') teacherId: string) {
    return this.reviewsService.forTeacher(teacherId);
  }

  @Post()
  @Roles('PARENT')
  create(@Req() req: { user?: { id: string } }, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(req.user?.id || '', dto);
  }

  @Patch(':id')
  @Roles('PARENT', 'ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(id, dto);
  }
}
