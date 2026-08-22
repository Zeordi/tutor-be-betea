import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendOtp(phoneNumber: string, code: string): Promise<boolean> {
    const message = `Your Tutor Be Betea code is ${code}. Valid for 5 minutes. Do not share this code.`;

    // ========== Africa's Talking (Recommended for Ethiopia) ==========
    if (process.env.AT_API_KEY && process.env.AT_USERNAME) {
      try {
        const AfricasTalking = require("africastalking")({
          apiKey: process.env.AT_API_KEY,
          username: process.env.AT_USERNAME,
        });

        const result = await AfricasTalking.SMS.send({
          to: [phoneNumber],
          message,
          from: process.env.AT_SENDER_ID || "TUTORBE",
        });

        this.logger.log(`SMS sent via Africa's Talking: ${JSON.stringify(result)}`);
        return true;
      } catch (error) {
        this.logger.error("Africa's Talking SMS failed", error);
      }
    }

    // ========== Fallback: Development log ==========
    this.logger.warn(`[DEV SMS] To: ${phoneNumber} | Code: ${code}`);
    console.log(`\n========== OTP ==========`);
    console.log(`Phone: ${phoneNumber}`);
    console.log(`Code:  ${code}`);
    console.log(`=========================\n`);

    return true;
  }
}
