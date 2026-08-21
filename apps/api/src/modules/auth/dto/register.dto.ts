import { IsString, IsEnum, IsOptional, IsEmail, Matches, MinLength } from "class-validator";

enum UserRole {
  PARENT = "PARENT",
  TEACHER = "TEACHER",
}

export class RegisterDto {
  @IsString()
  @Matches(/^(\+251|0)(9|7)\d{8}$/, {
    message: "Invalid Ethiopian phone number",
  })
  phoneNumber: string;

  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsEmail()
  email?: string;
}
