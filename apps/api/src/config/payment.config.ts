export const paymentConfig = {
  telebirr: {
    apiKey: process.env.TELEBIRR_API_KEY || "",
    apiSecret: process.env.TELEBIRR_API_SECRET || "",
    merchantId: process.env.TELEBIRR_MERCHANT_ID || "",
    baseUrl: process.env.TELEBIRR_BASE_URL || "https://api.telebirr.com",
    notifyUrl: process.env.TELEBIRR_NOTIFY_URL || "https://api.tutorbebetea.com/payments/webhook/telebirr",
  },
  cbeBirr: {
    apiKey: process.env.CBE_BIRR_API_KEY || "",
    merchantId: process.env.CBE_BIRR_MERCHANT_ID || "",
  },
};
