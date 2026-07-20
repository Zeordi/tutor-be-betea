import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

type SendResult = {
  to: string;
  subject: string;
  queued: true;
  delivered: boolean;
  mode: 'resend' | 'smtp' | 'log';
  id?: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;
  private readonly resendApiKey: string | undefined;

  constructor(private readonly config: ConfigService) {
    this.resendApiKey = this.config.get<string>('RESEND_API_KEY') || undefined;

    const host = this.config.get<string>('EMAIL_HOST') || this.config.get<string>('SMTP_HOST');
    const port = Number(this.config.get('EMAIL_PORT') || this.config.get('SMTP_PORT') || 587);
    const user = this.config.get<string>('EMAIL_USER') || this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('EMAIL_PASS') || this.config.get<string>('SMTP_PASS');

    if (this.resendApiKey) {
      this.logger.log('Email transport: Resend HTTP API (recommended on Railway)');
    } else if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        connectionTimeout: 20_000,
        greetingTimeout: 20_000,
        socketTimeout: 20_000,
      });
      this.logger.log(`Email transport: SMTP ${host}:${port}`);
    } else {
      this.logger.warn(
        'No RESEND_API_KEY or EMAIL_HOST/USER/PASS — emails will be logged only',
      );
    }
  }

  async send(to: string, subject: string, text: string, html?: string): Promise<SendResult> {
    const from =
      this.config.get<string>('EMAIL_FROM') ||
      this.config.get<string>('EMAIL_USER') ||
      'Tutor Be Betea <onboarding@resend.dev>';

    if (this.resendApiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text,
          html: html || text.replace(/\n/g, '<br/>'),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
      if (!res.ok) {
        this.logger.error(`Resend failed: ${res.status} ${body.message || JSON.stringify(body)}`);
        throw new Error(body.message || `Resend send failed (${res.status})`);
      }
      this.logger.log(`Email sent via Resend to=${to} id=${body.id}`);
      return { to, subject, queued: true, delivered: true, mode: 'resend', id: body.id };
    }

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from,
          to,
          subject,
          text,
          html: html || text.replace(/\n/g, '<br/>'),
        });
        this.logger.log(`Email sent via SMTP to=${to} id=${info.messageId}`);
        return {
          to,
          subject,
          queued: true,
          delivered: true,
          mode: 'smtp',
          id: info.messageId,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.error(`SMTP send failed: ${message}`);
        throw err;
      }
    }

    this.logger.log(`[email-fallback] to=${to} subject=${subject}\n${text}`);
    return { to, subject, queued: true, delivered: false, mode: 'log' };
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
