import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundDto } from './dto/refund.dto';

@Injectable()
export class PaymentsService {
  create(dto: CreatePaymentDto) {
    return {
      id: crypto.randomUUID(),
      bookingId: dto.bookingId,
      amount: dto.amount,
      currency: dto.currency || 'usd',
      status: 'requires_payment_method',
      clientSecret: `pi_test_${crypto.randomUUID()}_secret`,
    };
  }

  refund(dto: RefundDto) {
    return { paymentId: dto.paymentId, status: 'refunded', amount: dto.amount };
  }
}
