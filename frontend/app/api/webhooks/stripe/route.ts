import { NextResponse } from 'next/server';

/**
 * Do not point Stripe at this Next.js route.
 * Live webhook: https://api-production-53a9.up.railway.app/api/payments/webhooks/stripe
 * See docs/PAYMENTS.md and docs/INTEGRATIONS.md.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'Gone',
      message:
        'Use the Railway Stripe webhook URL, not this Next.js stub. See docs/PAYMENTS.md.',
    },
    { status: 410 },
  );
}
