import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationDto } from './dto/verification.dto';
import { UploadUrlDto } from './dto/upload-url.dto';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('teachers/verification')
@Roles('TEACHER')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get()
  status(@Req() req: { user?: { id: string } }) {
    return this.verificationService.getStatus(req.user?.id || '');
  }

  @Post('upload-url')
  uploadUrl(@Req() req: { user?: { id: string } }, @Body() dto: UploadUrlDto) {
    return this.verificationService.createUploadUrl(req.user?.id || '', dto);
  }

  @Post()
  submit(@Req() req: { user?: { id: string } }, @Body() dto: VerificationDto) {
    return this.verificationService.submit(req.user?.id || '', dto);
  }
}
