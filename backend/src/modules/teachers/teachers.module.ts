import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { VerificationController } from './verification/verification.controller';
import { VerificationService } from './verification/verification.service';
import { AvailabilityController } from './availability/availability.controller';
import { AvailabilityService } from './availability/availability.service';

@Module({
  controllers: [TeachersController, VerificationController, AvailabilityController],
  providers: [TeachersService, VerificationService, AvailabilityService],
  exports: [TeachersService],
})
export class TeachersModule {}
