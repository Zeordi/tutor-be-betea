import { IsString, Matches } from "class-validator";

export class LoginDto {
  @IsString()
  @Matches(/^(\+251|0)(9|7)\d{8}$/, {
    message: "Invalid Ethiopian phone number",
  })
  phoneNumber: string;

  @IsString()
  password?: string; // Optional if using OTP later
}
