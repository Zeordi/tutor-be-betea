import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { RefundDto } from './dto/refund.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

type AuthRequest = {
  user?: { id: string; userType?: string };
};

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles('PARENT', 'ADMIN')
  create(@Body() dto: CreatePaymentDto, @Req() req: AuthRequest) {
    return this.paymentsService.create(dto, {
      id: req.user?.id || '',
      userType: req.user?.userType,
    });
  }

  @Post('process')
  @Roles('PARENT', 'ADMIN')
  process(@Body() dto: ProcessPaymentDto, @Req() req: AuthRequest) {
    return this.paymentsService.process(dto, {
      id: req.user?.id || '',
      userType: req.user?.userType,
    });
  }

  @Post('refund')
  @Roles('ADMIN')
  refund(@Body() dto: RefundDto) {
    return this.paymentsService.refund(dto);
  }
}
