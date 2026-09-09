/** Thin placeholder until Stripe test keys exist. */
export const stripe = {
  paymentIntents: {
    async create(_args: {
      amount: number;
      currency?: string;
      metadata?: Record<string, string>;
    }) {
      return {
        id: "pi_stub_" + Date.now(),
        client_secret: "stub_secret",
        status: "requires_payment_method",
      };
    },
  },
  webhooks: {
    constructEvent(_payload: string, _sig: string, _secret: string) {
      return { type: "stub.event", data: { object: {} } };
    },
  },
};

export default stripe;