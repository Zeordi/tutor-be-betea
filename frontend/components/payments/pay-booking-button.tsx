'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

type PayResult = {
  clientSecret: string;
  status: string;
  bookingId: string;
};

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe() {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return null;
  if (!stripePromise) stripePromise = loadStripe(key);
  return stripePromise;
}

function CheckoutForm({
  onDone,
  onError,
}: {
  onDone: () => void;
  onError: (message: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    onError('');
    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/parent/bookings`,
        },
      });
      if (result.error) {
        onError(result.error.message || 'Payment failed');
        return;
      }
      onDone();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-tutor-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-tutor-green-700 disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {busy ? 'Processing…' : 'Pay now'}
      </button>
    </form>
  );
}

export function PayBookingButton({
  bookingId,
  amount,
  paymentStatus,
  bookingStatus,
  onPaid,
}: {
  bookingId: string;
  amount: number;
  paymentStatus?: string;
  bookingStatus: string;
  onPaid: () => void;
}) {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [open, setOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  const [waitingWebhook, setWaitingWebhook] = useState(false);

  const canPay =
    bookingStatus === 'PENDING' &&
    (paymentStatus === 'PENDING' || paymentStatus === 'FAILED') &&
    Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  const stripePkMissing = !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  const options = useMemo(
    () =>
      clientSecret
        ? {
            clientSecret,
            appearance: { theme: 'stripe' as const },
          }
        : undefined,
    [clientSecret],
  );

  async function startPay() {
    if (!token) {
      setError('Sign in required');
      return;
    }
    setStarting(true);
    setError('');
    setWaitingWebhook(false);
    try {
      const result = await apiClient.post<PayResult>(
        ENDPOINTS.payments.create,
        { bookingId },
        token,
      );
      if (!result.clientSecret) {
        throw new Error('No clientSecret returned — teacher may need to accept first');
      }
      setClientSecret(result.clientSecret);
      setOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start payment');
    } finally {
      setStarting(false);
    }
  }

  if (stripePkMissing && bookingStatus === 'PENDING' && (paymentStatus === 'PENDING' || paymentStatus === 'FAILED')) {
    return (
      <p className="text-xs text-amber-700">
        Payment UI needs NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY on Vercel.
      </p>
    );
  }

  if (!canPay) {
    return null;
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={starting}
        onClick={() => void startPay()}
        className="rounded-lg bg-tutor-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-tutor-green-700 disabled:opacity-60"
      >
        {starting ? 'Preparing…' : `Pay $${amount.toFixed(2)}`}
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {waitingWebhook ? (
        <p className="text-xs text-slate-600">
          Payment submitted. Booking confirms when the Stripe webhook reaches the API.
        </p>
      ) : null}

      {open && clientSecret ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Pay for lesson</h3>
                <p className="text-sm text-slate-600">${amount.toFixed(2)} · card</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setClientSecret(null);
                }}
                className="text-sm text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>
            <Elements stripe={getStripe()} options={options}>
              <CheckoutForm
                onDone={() => {
                  setWaitingWebhook(true);
                  setOpen(false);
                  setClientSecret(null);
                  onPaid();
                }}
                onError={setError}
              />
            </Elements>
          </div>
        </div>
      ) : null}
    </div>
  );
}
