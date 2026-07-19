import { Body, Controller, Get, Put } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilityDto } from './dto/availability.dto';

@Controller('teachers/availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  list() {
    return this.availabilityService.list();
  }

  @Put()
  set(@Body() dto: AvailabilityDto) {
    return this.availabilityService.set(dto);
  }
}
