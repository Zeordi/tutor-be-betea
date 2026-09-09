export const stripe = {
  paymentIntents: {
    create: async (_args: any) => ({
      id: "pi_stub",
      client_secret: "stub_secret",
      status: "requires_payment_method",
    }),
  },
};