import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private client: Stripe;

  constructor(private readonly config: ConfigService) {
    this.client = new Stripe(this.config.get<string>('stripe.secretKey') || 'sk_test_xxx', {
      apiVersion: '2024-06-20',
    });
  }

  get stripe() {
    return this.client;
  }
}
