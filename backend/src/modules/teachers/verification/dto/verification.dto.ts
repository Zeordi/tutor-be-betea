import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class VerificationDto {
  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  documentUrl?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({ require_tld: false }, { each: true })
  documentUrls?: string[];

  @IsOptional()
  @IsString()
  verificationType?: string;
}
