import { Controller, Headers, Post, Req } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('payments/webhooks/stripe')
export class StripeWebhookController {
  @Public()
  @Post()
  handle(@Req() req: { rawBody?: Buffer }, @Headers('stripe-signature') signature?: string) {
    return {
      received: true,
      signaturePresent: Boolean(signature),
      bytes: req.rawBody?.length ?? 0,
    };
  }
}
