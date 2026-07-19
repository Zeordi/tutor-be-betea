import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VeriffService {
  constructor(private readonly config: ConfigService) {}

  async createSession(userId: string) {
    return {
      userId,
      sessionId: `veriff_${userId}`,
      url: `${this.config.get('veriff.baseUrl')}/v1/sessions`,
    };
  }
}
