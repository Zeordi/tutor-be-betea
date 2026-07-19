import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  bookingId!: string;

  @IsNumber()
  @Min(0.5)
  amount!: number;

  @IsOptional()
  @IsString()
  currency?: string;
}
