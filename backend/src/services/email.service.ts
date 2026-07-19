import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: ConfigService) {}

  async send(to: string, subject: string, body: string) {
    this.logger.log(`Email to=${to} subject=${subject} via ${this.config.get('email.host')}`);
    return { to, subject, body, queued: true };
  }
}
