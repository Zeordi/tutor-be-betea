import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export enum RegisterRole {
  PARENT = 'PARENT',
  TEACHER = 'TEACHER',
}

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(RegisterRole)
  role!: RegisterRole;
}
