import { IsString, MinLength } from "class-validator";

export class PasswordForgotDto {
  @IsString()
  phoneNumber!: string;
}

export class PasswordResetDto {
  @IsString()
  phoneNumber!: string;

  /** From POST /auth/otp/verify after forgot flow */
  @IsString()
  verificationToken!: string;

  @IsString()
  @MinLength(6)
  newPassword!: string;
}