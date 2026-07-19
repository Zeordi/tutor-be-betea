import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { StripeWebhookController } from './webhooks/stripe-webhook.controller';
import { StripeService } from '../../services/stripe.service';

@Module({
  controllers: [PaymentsController, StripeWebhookController],
  providers: [PaymentsService, StripeService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
