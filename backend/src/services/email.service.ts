import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: ConfigService) {}

  async send(to: string, subject: string, body: string) {
    this.logger.log(`Email to=${to} subject=${subject} via ${this.config.get('EMAIL_HOST')}`);
    return { to, subject, body, queued: true };
  }

  async sendVerificationEmail(params: { email: string; name: string; token: string }) {
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const verifyUrl = `${frontendUrl}/verify-email?token=${params.token}`;
    return this.send(
      params.email,
      'Verify your Tutor Be Betea account',
      `Hi ${params.name},\n\nVerify your email: ${verifyUrl}\n`,
    );
  }
}
