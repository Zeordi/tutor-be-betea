import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherProfileDto } from './dto/create-teacher-profile.dto';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

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
