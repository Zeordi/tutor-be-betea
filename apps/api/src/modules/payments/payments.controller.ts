import { Controller, Post, Get, Body, UseGuards, Param, Query, Req } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { isProviderConfigured, verifyTelebirrSignature, verifyCbeBirrSignature, verifyMpesaSignature, verifyStripeSignature, paymentConfig } from "../../config/payment.config";
import { Request } from "express";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get("wallet")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  getWallet(@CurrentUser() user: any) {
    return this.paymentsService.getParentWallet(user.id);
  }

  @Get("earnings")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  getEarnings(@CurrentUser() user: any) {
    return this.paymentsService.getTeacherEarnings(user.id);
  }

  @Post("initiate")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  initiatePayment(@CurrentUser() user: any, @Body() body: any) {
    return this.paymentsService.initiatePayment({
      userId: user.id,
      contractId: body.contractId,
      amount: body.amount,
      provider: body.provider,
    });
  }

  @Post("payout")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  requestPayout(@CurrentUser() user: any, @Body() body: any) {
    return this.paymentsService.requestPayout(
      user.id,
      Number(body.amount),
      body.provider,
    );
  }

  @Post("webhook/telebirr")
  handleTelebirrWebhook(@Req() req: Request, @Body() body: any) {
    const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
    const signature = req.headers["x-telebirr-signature"] as string | undefined;
    if (!verifyTelebirrSignature(raw, signature, paymentConfig.telebirr.apiSecret)) {
      return { ok: false, reason: "invalid_signature" };
    }
    return this.paymentsService.handleWebhook("TELEBIRR", body);
  }

  @Post("webhook/cbe")
  handleCbeWebhook(@Req() req: Request, @Body() body: any) {
    const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
    const signature = req.headers["x-cbe-signature"] as string | undefined;
    if (!verifyCbeBirrSignature(raw, signature, paymentConfig.cbeBirr.apiKey)) {
      return { ok: false, reason: "invalid_signature" };
    }
    return this.paymentsService.handleWebhook("CBE_BIRR", body);
  }

  @Post("webhook/mpesa")
  handleMpesaWebhook(@Req() req: Request, @Body() body: any) {
    const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
    const signature = req.headers["x-mpesa-signature"] as string | undefined;
    if (!verifyMpesaSignature(raw, signature, paymentConfig.mpesa.apiKey)) {
      return { ok: false, reason: "invalid_signature" };
    }
    return this.paymentsService.handleWebhook("MPESA", body);
  }

  @Get("status/:paymentId")
  @UseGuards(JwtAuthGuard)
  getStatus(@Param("paymentId") paymentId: string) {
    return this.paymentsService.getPaymentStatus(paymentId);
  }

  @Post("reconcile/:paymentId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "FINANCE")
  reconcilePayment(@Param("paymentId") paymentId: string) {
    return this.paymentsService.reconcilePayment(paymentId);
  }

  @Post("webhook/stripe")
  handleStripeWebhook(@Req() req: Request, @Body() body: any) {
    const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
    const signature = req.headers["stripe-signature"] as string | undefined;
    if (!verifyStripeSignature(raw, signature, paymentConfig.stripe.webhookSecret)) {
      return { ok: false, reason: "invalid_signature" };
    }
    return this.paymentsService.handleWebhook("STRIPE", body);
  }

  @Get("status/check")
  checkProviders(@Query("provider") provider?: string) {
    if (provider) {
      return { provider: provider.toUpperCase(), available: isProviderConfigured(provider) };
    }
    return {
      TELEBIRR: isProviderConfigured("TELEBIRR"),
      CBE_BIRR: isProviderConfigured("CBE_BIRR"),
      MPESA: isProviderConfigured("MPESA"),
      STRIPE: isProviderConfigured("STRIPE"),
    };
  }
}