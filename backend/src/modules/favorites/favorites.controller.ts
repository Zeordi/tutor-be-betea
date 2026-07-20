import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('favorites')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PARENT')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  list(@Req() req: { user?: { id: string } }) {
    return this.favoritesService.list(req.user?.id || '');
  }

  @Get('ids')
  ids(@Req() req: { user?: { id: string } }) {
    return this.favoritesService.teacherIds(req.user?.id || '');
  }

  @Post()
  add(@Req() req: { user?: { id: string } }, @Body() dto: CreateFavoriteDto) {
    return this.favoritesService.add(req.user?.id || '', dto.teacherId);
  }

  @Delete(':teacherId')
  remove(
    @Req() req: { user?: { id: string } },
    @Param('teacherId') teacherId: string,
  ) {
    return this.favoritesService.remove(req.user?.id || '', teacherId);
  }
}
