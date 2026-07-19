import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum BookingStatusDto {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
}

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatusDto)
  status?: BookingStatusDto;

  @IsOptional()
  @IsString()
  notes?: string;
}
