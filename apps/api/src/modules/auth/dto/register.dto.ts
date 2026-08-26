import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

enum UserRole {
  PARENT = "PARENT",
  TEACHER = "TEACHER",
}

export class RegisterDto {
  @IsString()
  phoneNumber!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsString()
  @MinLength(6)
  password!: string;

  /** From POST /auth/otp/verify */
  @IsString()
  verificationToken!: string;
}