import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  // Forward or verify Stripe webhook signatures in production
  console.info('Stripe webhook received', payload.slice(0, 120));
  return NextResponse.json({ received: true });
}
