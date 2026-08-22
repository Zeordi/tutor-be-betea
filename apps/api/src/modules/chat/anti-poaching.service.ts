import { Injectable } from "@nestjs/common";
import { RESTRICTED_PATTERNS } from "@tutor/validators";

@Injectable()
export class AntiPoachingService {
  private readonly replacement = "[RESTRICTED CONTACT INFO]";

  sanitize(content: string): string {
    let sanitized = content;

    // Ethiopian phone numbers (+251... / 09... / 07...)
    sanitized = sanitized.replace(RESTRICTED_PATTERNS.ethiopianPhone, this.replacement);

    // Emails
    sanitized = sanitized.replace(RESTRICTED_PATTERNS.email, this.replacement);

    // Telegram handles
    sanitized = sanitized.replace(RESTRICTED_PATTERNS.telegram, this.replacement);

    // Bank account numbers
    sanitized = sanitized.replace(RESTRICTED_PATTERNS.bankAccount, this.replacement);

    // Extra: common social media
    sanitized = sanitized.replace(/(whatsapp|telegram|imo|viber)\s*[:.]?\s*\+?\d+/gi, this.replacement);

    return sanitized;
  }

  containsRestrictedInfo(content: string): boolean {
    return (
      RESTRICTED_PATTERNS.ethiopianPhone.test(content) ||
      RESTRICTED_PATTERNS.email.test(content) ||
      RESTRICTED_PATTERNS.telegram.test(content) ||
      RESTRICTED_PATTERNS.bankAccount.test(content)
    );
  }
}
