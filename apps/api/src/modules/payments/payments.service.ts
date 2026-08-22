import { Injectable, BadRequestException } from "@nestjs/common";

@Injectable()
export class PaymentsService {
  /**
   * Initiate payment with Telebirr
   * Docs: https://developer.ethiotelecom.et/
   */
  async initiateTelebirrPayment(params: {
    amount: number;
    orderId: string;
    customerPhone: string;
    description: string;
  }) {
    // TODO: Replace with real Telebirr API call
    console.log("[Telebirr] Initiating payment:", params);

    return {
      provider: "TELEBIRR",
      paymentUrl: `https://telebirr.ethiotelecom.et/pay?order=${params.orderId}`,
      orderId: params.orderId,
      status: "PENDING",
    };
  }

  /**
   * Initiate payment with CBE Birr
   */
  async initiateCbeBirrPayment(params: {
    amount: number;
    orderId: string;
    customerAccount: string;
    description: string;
  }) {
    console.log("[CBE Birr] Initiating payment:", params);

    return {
      provider: "CBE_BIRR",
      orderId: params.orderId,
      status: "PENDING",
      message: "Payment request sent to CBE Birr",
    };
  }

  /**
   * Generic payment initiator
   */
  async initiatePayment(params: {
    provider: "TELEBIRR" | "CBE_BIRR" | "STRIPE";
    amount: number;
    orderId: string;
    customerPhone?: string;
    customerAccount?: string;
    description: string;
  }) {
    switch (params.provider) {
      case "TELEBIRR":
        return this.initiateTelebirrPayment({
          amount: params.amount,
          orderId: params.orderId,
          customerPhone: params.customerPhone!,
          description: params.description,
        });
      case "CBE_BIRR":
        return this.initiateCbeBirrPayment({
          amount: params.amount,
          orderId: params.orderId,
          customerAccount: params.customerAccount!,
          description: params.description,
        });
      default:
        throw new BadRequestException("Unsupported payment provider");
    }
  }

  async handleWebhook(provider: string, payload: any) {
    // TODO: Verify signature and update contract/escrow status
    console.log(`[Webhook] ${provider}`, payload);
    return { received: true };
  }
}
