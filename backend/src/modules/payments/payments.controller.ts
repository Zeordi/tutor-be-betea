import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { RefundDto } from './dto/refund.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Post('process')
  process(@Body() dto: ProcessPaymentDto) {
    return this.paymentsService.process(dto);
  }

  @Post('refund')
  refund(@Body() dto: RefundDto) {
    return this.paymentsService.refund(dto);
  }
}
