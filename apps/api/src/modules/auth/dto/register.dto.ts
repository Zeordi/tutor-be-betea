import { IsString, IsEnum, IsOptional, IsEmail, MinLength } from "class-validator";

enum UserRole {
  PARENT = "PARENT",
  TEACHER = "TEACHER",
}

export class RegisterDto {
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEnum(UserRole)
  role: UserRole;
}