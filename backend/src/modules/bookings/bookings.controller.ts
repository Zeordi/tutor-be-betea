import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ListBookingsDto } from './dto/list-bookings.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @Roles('PARENT', 'TEACHER', 'ADMIN')
  list(
    @Req() req: { user?: { id: string; userType?: string; teacherProfile?: { id: string } } },
    @Query() query: ListBookingsDto,
  ) {
    return this.bookingsService.listBookings(
      {
        id: req.user?.id || '',
        userType: req.user?.userType,
        teacherProfile: req.user?.teacherProfile,
      },
      query,
    );
  }

  @Get(':id')
  @Roles('PARENT', 'TEACHER', 'ADMIN')
  getOne(
    @Param('id') id: string,
    @Req() req: { user?: { id: string; userType?: string; teacherProfile?: { id: string } } },
  ) {
    return this.bookingsService.getBooking(id, {
      id: req.user?.id || '',
      userType: req.user?.userType,
      teacherProfile: req.user?.teacherProfile,
    });
  }

  @Post()
  @Roles('PARENT')
  create(@Req() req: { user?: { id: string } }, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user?.id || '', dto);
  }

  @Put(':id/confirm')
  @Roles('TEACHER')
  confirmPut(
    @Param('id') id: string,
    @Req() req: { user?: { id: string; teacherProfile?: { id: string } } },
  ) {
    return this.confirm(id, req);
  }

  @Post(':id/confirm')
  @Roles('TEACHER')
  confirmPost(
    @Param('id') id: string,
    @Req() req: { user?: { id: string; teacherProfile?: { id: string } } },
  ) {
    return this.confirm(id, req);
  }

  @Post(':id/complete')
  @Roles('TEACHER')
  complete(
    @Param('id') id: string,
    @Req() req: { user?: { id: string; teacherProfile?: { id: string } } },
  ) {
    const teacherId = req.user?.teacherProfile?.id || req.user?.id || '';
    return this.bookingsService.completeBooking(id, teacherId);
  }

  @Post(':id/cancel')
  @Roles('PARENT', 'TEACHER', 'ADMIN')
  cancel(
    @Param('id') id: string,
    @Req() req: { user?: { id: string } },
    @Body('reason') reason: string,
  ) {
    return this.bookingsService.cancelBooking(id, req.user?.id || '', reason || 'Cancelled by user');
  }

  private confirm(
    id: string,
    req: { user?: { id: string; teacherProfile?: { id: string } } },
  ) {
    const teacherId = req.user?.teacherProfile?.id || req.user?.id || '';
    return this.bookingsService.confirmBooking(id, teacherId);
  }
}
