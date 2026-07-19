import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class UserManagementDto {
  @IsUUID()
  userId!: string;

  @IsOptional()
  @IsBoolean()
  disabled?: boolean;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;
}
