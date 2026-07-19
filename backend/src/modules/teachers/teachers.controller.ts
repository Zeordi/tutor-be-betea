import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherProfileDto } from './dto/create-teacher-profile.dto';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto';
import { SearchTeachersDto } from './dto/search-teachers.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Public()
  @Get('search')
  search(@Query() query: SearchTeachersDto) {
    return this.teachersService.search(query);
  }

  @Post()
  @Roles('TEACHER')
  create(@Req() req: any, @Body() createTeacherDto: CreateTeacherProfileDto) {
    return this.teachersService.create(req.user.id, createTeacherDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.teachersService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(id);
  }

  @Put('me')
  @Roles('TEACHER')
  updateMe(@Req() req: any, @Body() updateTeacherDto: UpdateTeacherProfileDto) {
    return this.teachersService.update(req.user.id, updateTeacherDto);
  }

  @Put(':id')
  @Roles('TEACHER', 'ADMIN')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherProfileDto,
  ) {
    if (req.user.userType === 'ADMIN') {
      return this.teachersService.updateById(id, updateTeacherDto);
    }
    return this.teachersService.update(req.user.id, updateTeacherDto);
  }
}
