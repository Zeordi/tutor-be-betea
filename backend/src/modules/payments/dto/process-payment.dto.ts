import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ProcessPaymentDto {
  @IsUUID()
  bookingId!: string;

  @IsString()
  paymentMethodId!: string;
}
