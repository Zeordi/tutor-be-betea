import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly token = process.env.AFROMESSAGE_TOKEN;
  private readonly identifierId =
    process.env.AFROMESSAGE_IDENTIFIER_ID || "e80ad9d8-adf3-463f-80f4-7c4b39f7f164";
  private readonly sender = process.env.AFROMESSAGE_SENDER_NAME || "";
  private readonly apiUrl = "https://api.afromessage.com/api/send";

  /**
   * Normalizes Ethiopian phone numbers to international E.164 standard (+251...)
   */
  private formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("09") || cleaned.startsWith("07")) {
      return `+251${cleaned.slice(1)}`;
    }
    if (cleaned.startsWith("251")) {
      return `+${cleaned}`;
    }
    return cleaned.startsWith("+") ? cleaned : `+251${cleaned}`;
  }

  /**
   * Sends an OTP verification code
   */
  async sendOtp(phoneNumber: string, code: string): Promise<boolean> {
    const message = `Your Tutor Be Betea verification code is: ${code}. Valid for 5 minutes.`;
    return this.sendSms(phoneNumber, message);
  }

  /**
   * Sends an SMS via AfroMessage HTTP API
   */
  async sendSms(to: string, message: string): Promise<boolean> {
    const recipient = this.formatPhoneNumber(to);

    if (!this.token) {
      this.logger.warn("AFROMESSAGE_TOKEN not set. Mock SMS logged to console:");
      this.logger.log(`[AfroMessage Mock] To: ${recipient} | Message: ${message}`);
      return true; // Fallback so local dev doesn't break
    }

    try {
      const url = new URL(this.apiUrl);
      url.searchParams.append("to", recipient);
      url.searchParams.append("message", message);
      if (this.identifierId) {
        url.searchParams.append("from", this.identifierId);
      }
      if (this.sender) {
        url.searchParams.append("sender", this.sender);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.status === "error" || data.acknowledge === "error") {
        this.logger.error(
          `AfroMessage delivery failed for ${recipient}: ${JSON.stringify(data)}`
        );
        return false;
      }

      this.logger.log(`✅ SMS successfully delivered to ${recipient}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${recipient}`, error);
      return false;
    }
  }
}