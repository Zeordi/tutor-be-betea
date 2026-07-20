# Launch integrations

Checklist for the finished-product loop. Manual Veriff, push notifications, and advanced analytics can wait.

## Must have

| Integration | Status in code | What you still configure |
|-------------|----------------|--------------------------|
| **Redis** | Auth refresh / verify / reset tokens via `CacheService` | Railway `REDIS_URL` (already live on `tutor-be-betea-api`) |
| **S3 uploads** | Presigned PUT + teacher verification UI | AWS bucket + `AWS_*` on Railway |
| **Stripe webhooks** | Nest webhook + parent Pay UI | Stripe Dashboard endpoint + `STRIPE_*` keys |

## Redis

- Used for `refresh_token:*`, `email_verification:*`, `password_reset:*` (not HTTP sessions).
- Health: `GET /api/health` returns `cache: "redis"` and `redis: "up"` when connected.
- Without Redis, the API falls back to in-memory cache (breaks across restarts / multiple instances).

## S3 (verification documents)

1. Create an S3 bucket (e.g. `tutor-be-betea-docs`) in your region.
2. CORS (browser PUT from the Vercel origin):

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedOrigins": ["https://tutor-be-betea.vercel.app", "http://localhost:3000"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

3. For admin review links to open in-browser, allow public `GetObject` on `verifications/*` (or switch to signed GETs later).
4. Set on Railway `api`:

| Variable | Example |
|----------|---------|
| `AWS_REGION` | `us-east-1` |
| `AWS_S3_BUCKET` | `tutor-be-betea-docs` |
| `AWS_ACCESS_KEY_ID` | IAM key with `s3:PutObject` (and GetObject if private) |
| `AWS_SECRET_ACCESS_KEY` | … |

5. Teacher flow: `/teacher/verification` → `POST /api/teachers/verification/upload-url` → browser `PUT` to S3 → `POST /api/teachers/verification` with `documentUrls`.
6. Admin approves at `/admin/verifications` (manual review; Veriff deferred).

## Stripe webhooks (you don’t have one yet)

Booking stays `PENDING` until Stripe hits the **Railway** webhook after a successful card payment.

### 1. API keys (Railway `api`)

| Variable | Where |
|----------|--------|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys (`sk_test_…` or live) |
| `STRIPE_WEBHOOK_SECRET` | Created when you add the endpoint below (`whsec_…`) |

### 2. Publishable key (Vercel frontend)

| Variable | Where |
|----------|--------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same Stripe account (`pk_test_…`) |

Redeploy Vercel after setting it.

### 3. Create the webhook endpoint in Stripe

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. Endpoint URL:

```
https://api-production-53a9.up.railway.app/api/payments/webhooks/stripe
```

3. Events to send:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy the **Signing secret** into Railway as `STRIPE_WEBHOOK_SECRET`.
5. Redeploy / restart the Railway `api` service so it picks up the vars.

Do **not** use `https://tutor-be-betea.vercel.app/api/webhooks/stripe` — that stub returns **410**.

### 4. Pay loop

```
Parent books → Teacher accepts (creates PaymentIntent)
→ Parent clicks Pay on /parent/bookings (Stripe Elements)
→ Stripe webhook → Payment SUCCEEDED + Booking CONFIRMED
```

Local testing without Dashboard: `stripe listen --forward-to localhost:4000/api/payments/webhooks/stripe`

## Can wait

| Item | Notes |
|------|--------|
| Push notifications | DB notification rows only; no FCM/APNs |
| Full Veriff | Manual admin review is enough for first launch |
| Advanced analytics | `/admin/analytics` placeholder |

## Smoke test

1. `GET https://api-production-53a9.up.railway.app/api/health` → `redis: "up"`
2. Teacher uploads a doc on `/teacher/verification`
3. Admin sees it on `/admin/verifications` and can approve
4. Parent pays after teacher accept; booking becomes `CONFIRMED` only after webhook delivery
