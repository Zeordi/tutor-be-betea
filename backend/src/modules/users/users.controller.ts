import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@Req() req: { user?: { id: string } }) {
    return this.usersService.findById(req.user?.id || '');
  }

  @Patch('me')
  update(@Req() req: { user?: { id: string } }, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user?.id || '', dto);
  }
}
