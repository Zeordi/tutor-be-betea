import { Injectable } from "@nestjs/common";
import { RESTRICTED_PATTERNS } from "@tutor/validators";

@Injectable()
export class AntiPoachingService {
  private readonly replacement = "[RESTRICTED CONTACT INFO]";

  sanitize(content: string): { sanitizedText: string; blocked: boolean } {
    let sanitizedText = content;

    // Ethiopian phone numbers (+251... / 09... / 07...)
    sanitizedText = sanitizedText.replace(
      RESTRICTED_PATTERNS.ethiopianPhone,
      this.replacement,
    );

    // Emails
    sanitizedText = sanitizedText.replace(
      RESTRICTED_PATTERNS.email,
      this.replacement,
    );

    // Telegram handles
    sanitizedText = sanitizedText.replace(
      RESTRICTED_PATTERNS.telegram,
      this.replacement,
    );

    // Bank account numbers
    sanitizedText = sanitizedText.replace(
      RESTRICTED_PATTERNS.bankAccount,
      this.replacement,
    );

    // Extra: common social media contact patterns
    sanitizedText = sanitizedText.replace(
      /(whatsapp|telegram|imo|viber)\s*[:.]?\s*\+?\d+/gi,
      this.replacement,
    );

    const blocked =
      sanitizedText !== content || this.containsRestrictedInfo(content);

    return {
      sanitizedText,
      blocked,
    };
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