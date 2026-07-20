import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from '../../auth/decorators/public.decorator';
import { StripeService } from '../../../services/stripe.service';

@Controller('payments/webhooks/stripe')
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Public()
  @Post()
  handle(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature?: string,
  ) {
    if (!signature) {
      throw new UnauthorizedException('Missing stripe-signature header');
    }
    if (!req.rawBody || !Buffer.isBuffer(req.rawBody)) {
      throw new BadRequestException(
        'Raw request body unavailable — enable NestFactory rawBody for Stripe webhooks',
      );
    }
    return this.stripeService.handleWebhook(req.rawBody, signature);
  }
}
