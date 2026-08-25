import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("otp/send")
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body("phoneNumber") phoneNumber?: string, @Body("email") email?: string) {
    return this.authService.sendOtp(phoneNumber || email || "test@tutorbebetea.com");
  }

  @Post("otp/verify")
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body("phoneNumber") phoneNumber: string,
    @Body("email") email: string,
    @Body("code") code: string,
  ) {
    return this.authService.verifyOtp(phoneNumber || email, code);
  }

  @Post("demo-login")
  @HttpCode(HttpStatus.OK)
  async demoLogin(@Body("role") role: "PARENT" | "TEACHER") {
    return this.authService.demoLogin(role || "PARENT");
  }
}