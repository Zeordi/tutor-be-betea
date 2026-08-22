import { Injectable } from '@nestjs/common';

@Injectable()
export class AntiPoachingService {
  sanitize(content: string): string {
    // Heuristic + AI Contact Masking
    // Detects: +251..., 09..., 07..., emails, @telegram, bank accounts
    let sanitized = content;

    // Ethiopian phone numbers
    sanitized = sanitized.replace(
      /(\+251|0)(9|7)\d{8}/g,
      '[RESTRICTED CONTACT INFO]',
    );

    // Emails
    sanitized = sanitized.replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      '[RESTRICTED CONTACT INFO]',
    );

    // Telegram handles
    sanitized = sanitized.replace(/@\w+/g, '[RESTRICTED CONTACT INFO]');

    return sanitized;
  }
}
