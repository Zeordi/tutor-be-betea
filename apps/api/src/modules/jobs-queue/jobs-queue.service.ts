import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class JobsQueueService {
  private readonly logger = new Logger(JobsQueueService.name);

  /**
   * Placeholder for background jobs
   * Later can be replaced with BullMQ + Redis
   */
  async addJob(name: string, data: any) {
    this.logger.log(`Queued job: ${name}`, data);
    // TODO: Integrate BullMQ
    return { queued: true, name };
  }

  async processPayouts() {
    this.logger.log("Processing pending payouts...");
    // TODO: Real payout processing
  }

  async sendReminderNotifications() {
    this.logger.log("Sending session reminders...");
    // TODO: Real reminder logic
  }
}
