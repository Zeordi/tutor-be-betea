export type ProviderConfig = {
  apiKey: string;
  apiSecret?: string;
  merchantId: string;
  baseUrl: string;
  notifyUrl: string;
};

export type TelebirrConfig = ProviderConfig & {
  apiSecret: string;
};

export type CbeBirrConfig = ProviderConfig & {
  apiKey: string;
  merchantId: string;
};

export const paymentConfig = {
  telebirr: {
    apiKey: process.env.TELEBIRR_API_KEY || "",
    apiSecret: process.env.TELEBIRR_API_SECRET || "",
    merchantId: process.env.TELEBIRR_MERCHANT_ID || "",
    baseUrl: process.env.TELEBIRR_BASE_URL || "https://api.telebirr.com",
    notifyUrl:
      process.env.TELEBIRR_NOTIFY_URL ||
      "https://api.tutorbebetea.com/payments/webhook/telebirr",
  } as TelebirrConfig,
  cbeBirr: {
    apiKey: process.env.CBE_BIRR_API_KEY || "",
    merchantId: process.env.CBE_BIRR_MERCHANT_ID || "",
    baseUrl: process.env.CBE_BIRR_BASE_URL || "https://api.cbebirr.com",
    notifyUrl:
      process.env.CBE_BIRR_NOTIFY_URL ||
      "https://api.tutorbebetea.com/payments/webhook/cbe",
  } as CbeBirrConfig,
  stripe: {
    apiKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    baseUrl: "https://api.stripe.com",
    notifyUrl: "",
  },
  mpesa: {
    apiKey: process.env.MPESA_API_KEY || "",
    merchantId: process.env.MPESA_MERCHANT_ID || "",
    baseUrl: process.env.MPESA_BASE_URL || "https://api.mpesa.com",
    notifyUrl:
      process.env.MPESA_NOTIFY_URL ||
      "https://api.tutorbebetea.com/payments/webhook/mpesa",
  },
};

export function isProviderConfigured(provider: string): boolean {
  switch (provider.toUpperCase()) {
    case "TELEBIRR":
      return (
        !!paymentConfig.telebirr.apiKey &&
        !!paymentConfig.telebirr.merchantId
      );
    case "CBE_BIRR":
      return (
        !!paymentConfig.cbeBirr.apiKey &&
        !!paymentConfig.cbeBirr.merchantId
      );
    case "MPESA":
      return (
        !!paymentConfig.mpesa.apiKey &&
        !!paymentConfig.mpesa.merchantId
      );
    case "STRIPE":
      return !!paymentConfig.stripe.apiKey;
    default:
      return false;
  }
}

export function getConfiguredProviders(): string[] {
  const providers: string[] = [];
  if (isProviderConfigured("TELEBIRR")) providers.push("TELEBIRR");
  if (isProviderConfigured("CBE_BIRR")) providers.push("CBE_BIRR");
  if (isProviderConfigured("MPESA")) providers.push("MPESA");
  if (isProviderConfigured("STRIPE")) providers.push("STRIPE");
  return providers;
}

/**
 * Request a payment checkout from a provider.
 * Returns a provider-specific checkout URL and a transaction reference.
 *
 * NOTE: These are production-shaped stubs. Replace the HTTP calls with
 * the official Telebirr / CBE Birr SDK or direct REST calls when
 * credentials are available.
 */
export async function requestTelebirrCheckout(params: {
  amount: number;
  currency: string;
  merchantId: string;
  notifyUrl: string;
  externalRef: string;
}): Promise<{ checkoutUrl: string; transactionId: string; expiresAt: string }> {
  const { baseUrl, apiKey, apiSecret } = paymentConfig.telebirr;
  if (!apiKey || !merchantId) {
    throw new Error("Telebirr is not configured");
  }

  const payload = {
    merchantId: params.merchantId,
    amount: params.amount,
    currency: params.currency,
    externalRef: params.externalRef,
    notifyUrl: params.notifyUrl,
    timestamp: new Date().toISOString(),
  };

  const response = await fetch(`${baseUrl}/v1/checkout/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-Merchant-Secret": apiSecret,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Telebirr checkout failed (${response.status})`);
  }

  const data = await response.json();
  return {
    checkoutUrl: data.checkoutUrl || data.data?.checkoutUrl,
    transactionId: data.transactionId || data.data?.transactionId || params.externalRef,
    expiresAt: data.expiresAt || data.data?.expiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  };
}

export async function requestCbeBirrCheckout(params: {
  amount: number;
  currency: string;
  merchantId: string;
  notifyUrl: string;
  externalRef: string;
}): Promise<{ checkoutUrl: string; transactionId: string; expiresAt: string }> {
  const { baseUrl, apiKey } = paymentConfig.cbeBirr;
  if (!apiKey || !merchantId) {
    throw new Error("CBE Birr is not configured");
  }

  const payload = {
    merchantId: params.merchantId,
    amount: params.amount,
    currency: params.currency,
    externalRef: params.externalRef,
    notifyUrl: params.notifyUrl,
    timestamp: new Date().toISOString(),
  };

  const response = await fetch(`${baseUrl}/v1/payments/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `CBE Birr checkout failed (${response.status})`);
  }

  const data = await response.json();
  return {
    checkoutUrl: data.checkoutUrl || data.data?.checkoutUrl,
    transactionId: data.transactionId || data.data?.transactionId || params.externalRef,
    expiresAt: data.expiresAt || data.data?.expiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  };
}

export async function requestMpesaCheckout(params: {
  amount: number;
  currency: string;
  merchantId: string;
  notifyUrl: string;
  externalRef: string;
}): Promise<{ checkoutUrl: string; transactionId: string; expiresAt: string }> {
  const { baseUrl, apiKey } = paymentConfig.mpesa;
  if (!apiKey || !merchantId) {
    throw new Error("M-Pesa is not configured");
  }

  const payload = {
    merchantId: params.merchantId,
    amount: params.amount,
    currency: params.currency,
    externalRef: params.externalRef,
    notifyUrl: params.notifyUrl,
    timestamp: new Date().toISOString(),
  };

  const response = await fetch(`${baseUrl}/v1/payments/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `M-Pesa checkout failed (${response.status})`);
  }

  const data = await response.json();
  return {
    checkoutUrl: data.checkoutUrl || data.data?.checkoutUrl,
    transactionId: data.transactionId || data.data?.transactionId || params.externalRef,
    expiresAt: data.expiresAt || data.data?.expiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  };
}
