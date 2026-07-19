import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export enum DisputeResolution {
  REFUND = 'REFUND',
  RELEASE = 'RELEASE',
  PARTIAL = 'PARTIAL',
}

export class DisputeResolutionDto {
  @IsUUID()
  bookingId!: string;

  @IsEnum(DisputeResolution)
  resolution!: DisputeResolution;

  @IsString()
  notes!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  refundAmount?: number;
}
