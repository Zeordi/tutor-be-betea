import { IsString, IsUrl } from 'class-validator';

export class VerificationDto {
  @IsString()
  @IsUrl()
  documentUrl!: string;
}
