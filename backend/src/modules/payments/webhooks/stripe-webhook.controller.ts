import { Controller, Headers, Post, Req } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { StripeService } from '../../../services/stripe.service';

@Controller('payments/webhooks/stripe')
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Public()
  @Post()
  handle(
    @Req() req: { rawBody?: Buffer; body?: Buffer | string },
    @Headers('stripe-signature') signature?: string,
  ) {
    const body = (req.rawBody || req.body || Buffer.from('')) as Buffer;
    return this.stripeService.handleWebhook(body, signature || '');
  }
}
