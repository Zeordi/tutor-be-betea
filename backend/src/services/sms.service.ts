import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async send(to: string, message: string) {
    this.logger.log(`SMS to=${to}: ${message}`);
    return { to, queued: true };
  }
}
