import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  private bookings: Array<CreateBookingDto & { id: string; status: string }> = [];

  findAll() {
    return this.bookings;
  }

  findOne(id: string) {
    return this.bookings.find((b) => b.id === id) || null;
  }

  create(dto: CreateBookingDto) {
    const booking = { id: crypto.randomUUID(), status: 'PENDING', ...dto };
    this.bookings.push(booking);
    return booking;
  }

  update(id: string, dto: UpdateBookingDto) {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) return null;
    Object.assign(booking, dto);
    return booking;
  }
}
