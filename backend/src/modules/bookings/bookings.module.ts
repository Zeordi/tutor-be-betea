import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { StripeService } from '../../services/stripe.service';
import { NotificationService } from '../../services/notification.service';

@Module({
  imports: [PrismaModule],
  controllers: [BookingsController],
  providers: [BookingsService, StripeService, NotificationService],
  exports: [BookingsService],
})
export class BookingsModule {}
