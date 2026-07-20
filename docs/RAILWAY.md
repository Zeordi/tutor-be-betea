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
| `REDIS_URL` | Railway Redis (`${{Redis.REDIS_URL}}`) — required for durable auth tokens |
| `NODE_ENV` | `production` |
| `PORT` | Set automatically by Railway |

### Launch integrations (set before go-live)

| Variable | Notes |
|----------|--------|
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | See `docs/INTEGRATIONS.md` — webhook URL below |
| `AWS_REGION` / `AWS_S3_BUCKET` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Teacher verification uploads |

Optional later: email / Resend, Veriff.

### Stripe webhooks (booking confirmation)

Booking confirmation is payment-gated. Point Stripe at:

`https://api-production-53a9.up.railway.app/api/payments/webhooks/stripe`

Nest is started with `rawBody: true` so signature verification works. Full steps: `docs/PAYMENTS.md` and `docs/INTEGRATIONS.md`.

## Deploy / redeploy

```bash
cd backend
npx @railway/cli@latest link   # once
npx @railway/cli@latest up -d -y
npx @railway/cli@latest domain  # once, generate public HTTPS
```

GitHub Actions workflow **Deploy** (`.github/workflows/deploy.yml`) verifies backend tests + frontend production build on every `main` push. Frontend production traffic is served by Vercel auto-deploy. API redeploys are done with Railway CLI (above), not the old SSH/docker path.

## Point the frontend at Railway

On Vercel project `tutor-be-betea`, set production:

- `NEXT_PUBLIC_API_URL=https://<railway-domain>/api`
- `NEXT_PUBLIC_WS_URL=https://<railway-domain>`

Then redeploy the frontend.
