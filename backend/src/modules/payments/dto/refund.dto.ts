import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class RefundDto {
  @IsString()
  paymentId!: string;

  @IsOptional()
  @IsNumber()
  @Min(0.5)
  amount?: number;
}
