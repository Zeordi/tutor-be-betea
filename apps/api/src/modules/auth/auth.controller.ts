// apps/api/src/modules/auth/auth.controller.ts
import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { GoogleAuthDto } from "./dto/google-auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("google")
  @HttpCode(HttpStatus.OK)
  google(@Body() dto: GoogleAuthDto) {
    return this.authService.googleAuth(dto);
  }

  @Post("otp/send")
  @HttpCode(HttpStatus.OK)
  sendOtp(
    @Body("phoneNumber") phoneNumber?: string,
    @Body("email") email?: string,
  ) {
    return this.authService.sendOtp(phoneNumber || email || "");
  }

  @Post("otp/verify")
  @HttpCode(HttpStatus.OK)
  verifyOtp(
    @Body("phoneNumber") phoneNumber: string,
    @Body("email") email: string,
    @Body("code") code: string,
  ) {
    return this.authService.verifyOtp(phoneNumber || email, code);
  }

  @Post("demo-login")
  @HttpCode(HttpStatus.OK)
  demoLogin(@Body("role") role: "PARENT" | "TEACHER") {
    return this.authService.demoLogin(role || "PARENT");
  }
}