import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Req() req: { user?: { id: string } }, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user?.id || '', dto);
  }

  @Post(':id/confirm')
  confirm(
    @Param('id') id: string,
    @Req() req: { user?: { id: string; teacherProfile?: { id: string } } },
  ) {
    const teacherId = req.user?.teacherProfile?.id || req.user?.id || '';
    return this.bookingsService.confirmBooking(id, teacherId);
  }

  @Post(':id/complete')
  complete(
    @Param('id') id: string,
    @Req() req: { user?: { id: string; teacherProfile?: { id: string } } },
  ) {
    const teacherId = req.user?.teacherProfile?.id || req.user?.id || '';
    return this.bookingsService.completeBooking(id, teacherId);
  }

  @Post(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Req() req: { user?: { id: string } },
    @Body('reason') reason: string,
  ) {
    return this.bookingsService.cancelBooking(id, req.user?.id || '', reason || 'Cancelled by user');
  }
}
