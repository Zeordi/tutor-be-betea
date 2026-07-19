import { Injectable } from '@nestjs/common';
import { AvailabilityDto } from './dto/availability.dto';

@Injectable()
export class AvailabilityService {
  private slots: AvailabilityDto['slots'] = [];

  list() {
    return this.slots;
  }

  set(dto: AvailabilityDto) {
    this.slots = dto.slots;
    return this.slots;
  }
}
