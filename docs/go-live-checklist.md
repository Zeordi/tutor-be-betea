# Go-Live Checklist

## Pre-Deployment (run from monorepo root)

- [ ] `pnpm check-types` — runs `turbo check-types` across web, api, admin, and workspace packages
- [ ] `pnpm build` — runs `turbo build` (web, admin, api, and dependent packages)
- [ ] `pnpm lint` — runs `turbo lint`
- [ ] `pnpm test` — runs `turbo test` (if test suite exists)
- [ ] `pnpm db:push` — applies any pending Prisma schema changes (`pnpm --filter @tutor/database push`)
- [ ] `pnpm db:generate` — regenerates Prisma client if schema changed (`pnpm --filter @tutor/database generate`)
- [ ] `pnpm smoke` — runs `scripts/smoke-test.sh` (health + auth + rate-limit probe)

## API (Render / VPS)

- [ ] `DATABASE_URL` set
- [ ] `JWT_SECRET` set (≥32 chars, not a weak default)
- [ ] `VAULT_MASTER_KEY` or `ENCRYPTION_KEY` set (64-hex or ≥32 chars)
- [ ] `AUDIT_CHAIN_SECRET` set (falls back to `JWT_SECRET` if absent)
- [ ] `SENTRY_DSN` set (optional but recommended)
- [ ] `SENTRY_TRACES_SAMPLE_RATE` configured (default `0.1` prod, `1.0` dev)
- [ ] `UPSTASH_REDIS_REST_URL` set
- [ ] `UPSTASH_REDIS_REST_TOKEN` set
- [ ] SMS provider credentials set (e.g., AfroMessage token/identifier)
- [ ] Payment provider credentials set (Telebirr, CBE Birr, M-Pesa, Stripe)
- [ ] Health check passes: `curl $API_URL/health` returns `{"status":"ok",...}`
- [ ] Rate limiting configured (auth: 5/min, payments: 10/min, general: 30/min)
- [ ] `.env` files are not committed (`.gitignore` includes `.env`)

## Web Admin (Vercel)

- [ ] `NEXT_PUBLIC_API_URL` set to production API
- [ ] Environment variables match staging

## Mobile (EAS)

- [ ] `API_URL` set in `eas.json`
- [ ] `SENTRY_DSN` set in `eas.json`
- [ ] Build profile ready: `eas build --platform all --profile production`

## Database

- [ ] Run `pnpm db:push` for any pending schema changes
- [ ] Verify `schema.prisma` is at expected version
- [ ] Run `pnpm db:generate` to regenerate Prisma client if needed
- [ ] Automated backups configured per Phase I runbook `01-backup-restore.md`

## Post-Deployment Verification

- [ ] Smoke tests pass: `pnpm smoke`
- [ ] OTP send/verify flow works end-to-end
- [ ] Payment initiation succeeds for a test contract
- [ ] Vault document upload succeeds and admin can decrypt
- [ ] Attendance check-in with geofence works
- [ ] Admin dashboard loads and lists tickets/risk flags
- [ ] Sentry captures a deliberate test error (if enabled)
