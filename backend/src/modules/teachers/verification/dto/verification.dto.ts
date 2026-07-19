import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class VerificationDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  documentUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documentUrls?: string[];

  @IsOptional()
  @IsString()
  verificationType?: string;
}
