import { Body, Controller, Get, Post } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationDto } from './dto/verification.dto';

@Controller('teachers/verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get()
  status() {
    return this.verificationService.getStatus();
  }

  @Post()
  submit(@Body() dto: VerificationDto) {
    return this.verificationService.submit(dto);
  }
}
