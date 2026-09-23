import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { GoogleAuthDto } from "./dto/google-auth.dto";
import {
  PasswordForgotDto,
  PasswordResetDto,
} from "./dto/password-reset.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { LogoutDto } from "./dto/logout.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

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
    @Body("phoneNumber") phoneNumber?: string,
    @Body("email") email?: string,
    @Body("code") code?: string,
  ) {
    return this.authService.verifyOtp(phoneNumber || email || "", code || "");
  }

  /** Step 1 forgot: sends OTP via AfroMessage (same as otp/send) */
  @Post("password/forgot")
  @HttpCode(HttpStatus.OK)
  passwordForgot(@Body() dto: PasswordForgotDto) {
    return this.authService.passwordForgot(dto.phoneNumber);
  }

  /** Step 2: after otp/verify → verificationToken + new password */
  @Post("password/reset")
  @HttpCode(HttpStatus.OK)
  passwordReset(@Body() dto: PasswordResetDto) {
    return this.authService.passwordReset(dto);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: any, @Body() dto: LogoutDto) {
    return this.authService.logout(user.id, user.jti, dto.refreshToken);
  }
}