# Railway deployment (Nest API)

## Live

| App | URL |
|-----|-----|
| API (Railway) | https://api-production-53a9.up.railway.app |
| Health | https://api-production-53a9.up.railway.app/api/health |
| Frontend (Vercel) | https://tutor-be-betea.vercel.app |

Railway project: `tutor-be-betea-api` (service `api`). Dashboard: https://railway.com/project/54e05c08-c8c4-4e7d-b7f2-6d644cb0543a

## Project layout

- Service root: `backend/`
- Config: `backend/railway.toml`
- Database: existing Neon Postgres (`DATABASE_URL`)
- Frontend stays on Vercel: https://tutor-be-betea.vercel.app

## Required env vars

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Neon pooled URL |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Same as Vercel API for session continuity |
| `FRONTEND_URL` | `https://tutor-be-betea.vercel.app` |
| `ADMIN_EMAIL` / `ADMIN_TEAM_EMAILS` | Team admin allowlist |
| `NODE_ENV` | `production` |
| `PORT` | Set automatically by Railway |

Optional: `REDIS_URL`, Stripe, email, Veriff, AWS.

### Stripe webhooks (booking confirmation)

Booking confirmation is payment-gated. Point Stripe at:

`https://api-production-53a9.up.railway.app/api/payments/webhooks/stripe`

Required vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`. Nest is started with `rawBody: true` so signature verification works. Details: `docs/PAYMENTS.md`.

## Deploy / redeploy

```bash
cd backend
npx @railway/cli@latest link   # once
npx @railway/cli@latest up -d -y
npx @railway/cli@latest domain  # once, generate public HTTPS
```

## Point the frontend at Railway

On Vercel project `tutor-be-betea`, set production:

- `NEXT_PUBLIC_API_URL=https://<railway-domain>/api`
- `NEXT_PUBLIC_WS_URL=https://<railway-domain>`

Then redeploy the frontend.
