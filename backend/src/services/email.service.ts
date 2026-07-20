import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('EMAIL_HOST') || this.config.get<string>('SMTP_HOST');
    const port = Number(this.config.get('EMAIL_PORT') || this.config.get('SMTP_PORT') || 587);
    const user = this.config.get<string>('EMAIL_USER') || this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('EMAIL_PASS') || this.config.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`Email transport configured via ${host}:${port}`);
    } else {
      this.logger.warn(
        'EMAIL_HOST/USER/PASS not fully configured — emails will be logged only (dev fallback)',
      );
    }
  }

  async send(to: string, subject: string, text: string, html?: string) {
    const from =
      this.config.get<string>('EMAIL_FROM') ||
      this.config.get<string>('EMAIL_USER') ||
      'Tutor Be Betea <noreply@tutor-be-betea.local>';

    if (!this.transporter) {
      this.logger.log(`[email-fallback] to=${to} subject=${subject}\n${text}`);
      return { to, subject, queued: true, delivered: false, mode: 'log' as const };
    }

    const info = await this.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br/>'),
    });

    this.logger.log(`Email sent to=${to} id=${info.messageId}`);
    return { to, subject, queued: true, delivered: true, mode: 'smtp' as const, id: info.messageId };
  }

  async sendVerificationEmail(params: { email: string; name: string; token: string }) {
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const verifyUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(params.token)}`;
    return this.send(
      params.email,
      'Verify your Tutor Be Betea account',
      `Hi ${params.name},\n\nVerify your email by opening this link:\n${verifyUrl}\n\nThis link expires in 24 hours.\n`,
      `<p>Hi ${params.name},</p><p><a href="${verifyUrl}">Verify your email</a></p><p>This link expires in 24 hours.</p>`,
    );
  }

  async sendPasswordResetEmail(params: { email: string; name: string; token: string }) {
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(params.token)}`;
    return this.send(
      params.email,
      'Reset your Tutor Be Betea password',
      `Hi ${params.name},\n\nReset your password here:\n${resetUrl}\n\nThis link expires in 1 hour. If you did not request this, ignore this email.\n`,
      `<p>Hi ${params.name},</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 1 hour.</p>`,
    );
  }
}
