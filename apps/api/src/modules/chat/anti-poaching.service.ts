import { Injectable } from "@nestjs/common";
import { RESTRICTED_PATTERNS } from "@tutor/validators";

export type SanitizeResult = {
  sanitizedText: string;
  blocked: boolean;
};

@Injectable()
export class AntiPoachingService {
  private readonly replacement = "[RESTRICTED CONTACT INFO]";

  sanitize(content: string): SanitizeResult {
    let sanitizedText = content;

    sanitizedText = sanitizedText.replace(
      RESTRICTED_PATTERNS.ethiopianPhone,
      this.replacement,
    );
    sanitizedText = sanitizedText.replace(
      RESTRICTED_PATTERNS.email,
      this.replacement,
    );
    sanitizedText = sanitizedText.replace(
      RESTRICTED_PATTERNS.telegram,
      this.replacement,
    );
    sanitizedText = sanitizedText.replace(
      RESTRICTED_PATTERNS.bankAccount,
      this.replacement,
    );
    sanitizedText = sanitizedText.replace(
      /(whatsapp|telegram|imo|viber)\s*[:.]?\s*\+?\d+/gi,
      this.replacement,
    );

    const blocked = sanitizedText !== content;

    return { sanitizedText, blocked };
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