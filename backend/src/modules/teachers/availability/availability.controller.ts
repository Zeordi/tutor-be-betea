import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilityDto } from './dto/availability.dto';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('teachers/availability')
@Roles('TEACHER')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  list(@Req() req: { user?: { id: string } }) {
    return this.availabilityService.list(req.user?.id || '');
  }

  @Put()
  set(@Req() req: { user?: { id: string } }, @Body() dto: AvailabilityDto) {
    return this.availabilityService.set(req.user?.id || '', dto);
  }
}
