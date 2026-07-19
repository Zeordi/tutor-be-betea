import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserType } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(10)
  phone!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(UserType)
  userType!: UserType;
}
