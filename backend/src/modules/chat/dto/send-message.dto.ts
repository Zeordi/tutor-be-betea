import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

/** Socket/REST send payload for booking-threaded chat. */
export class SendMessageDto {
  @IsUUID()
  bookingId!: string;

  @IsString()
  @MinLength(1)
  message!: string;

  @IsOptional()
  @IsString()
  attachment?: string;
}
