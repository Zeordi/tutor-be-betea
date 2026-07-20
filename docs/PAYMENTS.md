# Booking + payment state machine

## Canonical flow

```
Parent creates booking     → BookingStatus.PENDING (awaiting teacher)
Teacher accepts            → stays PENDING; creates Stripe PaymentIntent + Payment PENDING
Parent pays (Stripe.js)    → confirms PaymentIntent with clientSecret
Stripe webhook succeeds    → Payment SUCCEEDED + Booking CONFIRMED (+ notify)
Teacher completes lesson   → requires SUCCEEDED payment → COMPLETED + payout
```

Do **not** mark a booking `CONFIRMED` on teacher accept. Confirmation is payment-gated via the webhook.

## Endpoints

| Step | Method | Path | Notes |
|------|--------|------|--------|
| Accept | `PUT`/`POST` | `/api/bookings/:id/confirm` | Teacher only. Returns `{ booking, clientSecret, stripePaymentIntent }`. Booking stays `PENDING`. |
| Retry pay | `POST` | `/api/payments` | Parent (owner) or admin. Requires an existing payment row from accept. Amount always from booking. |
| Confirm | `POST` | `/api/payments/webhooks/stripe` | Public. Requires `stripe-signature` + Nest `rawBody`. |
| ~~Mark paid~~ | `POST` | `/api/payments/process` | **Gone (410)**. Removed to prevent client-side confirm. |

## Ownership

- Only the booking’s `parentId` (or `ADMIN`) may call `POST /api/payments`.
- Amount is never taken from the client body for charging; `CreatePaymentDto.amount` is ignored.

## Webhook / raw body

Nest is started with `{ rawBody: true }` in:

- `backend/src/main.ts` (Railway / local)
- `backend/api/index.ts` (legacy Vercel adapter)

The webhook controller rejects requests without a signature or without `req.rawBody`.

## Railway Stripe setup

You need a Stripe **webhook endpoint** before bookings can leave `PENDING` after card payment.

1. Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` on the Railway `api` service.
2. Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` on Vercel (parent Pay button).
3. In Stripe Dashboard → Webhooks → Add endpoint:

   `https://api-production-53a9.up.railway.app/api/payments/webhooks/stripe`

4. Subscribe at least to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Paste the endpoint signing secret into Railway as `STRIPE_WEBHOOK_SECRET` and restart `api`.

Do **not** use the Next.js route at `frontend/app/api/webhooks/stripe` (returns 410).

Parent UI: after teacher accept, `/parent/bookings` shows **Pay** and confirms the PaymentIntent with Stripe.js. Full checklist: `docs/INTEGRATIONS.md`.
