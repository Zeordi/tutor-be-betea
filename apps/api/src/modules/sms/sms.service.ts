import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendOtp(phoneNumber: string, code: string): Promise<boolean> {
    try {
      // In development / testing: Log the OTP to console
      this.logger.log(`Sending OTP [${code}] to ${phoneNumber}`);
      
      // TODO: Connect your SMS gateway (e.g. AfroMessage, Africa's Talking) here
      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${phoneNumber}`, error);
      return false;
    }
  }
}
