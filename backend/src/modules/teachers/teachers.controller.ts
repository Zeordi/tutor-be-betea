import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherProfileDto } from './dto/create-teacher-profile.dto';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get('search')
  search(
    @Query('subject') subject?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('rating') rating?: string,
    @Query('radius') radius?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.teachersService.search({
      subject,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      rating: rating ? Number(rating) : undefined,
      radius: radius ? Number(radius) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  @Get()
  findAll(@Query('q') q?: string) {
    return this.teachersService.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(id);
  }

  @Post('profile')
  create(@Body() dto: CreateTeacherProfileDto) {
    return this.teachersService.create(dto);
  }

  @Patch('profile')
  update(@Body() dto: UpdateTeacherProfileDto) {
    return this.teachersService.update(dto);
  }
}
