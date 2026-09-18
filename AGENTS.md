# Tutor Be Betea — Agent Quick Reference

## Quality Gates

```bash
# API
pnpm --filter api check-types
pnpm --filter api build

# Workspace packages
pnpm --filter @tutor/database build
pnpm --filter @tutor/encryption build
pnpm --filter @tutor/validators build
pnpm --filter @tutor/geo build
pnpm --filter @tutor/audit build
pnpm --filter @tutor/types build

# Admin / Web / Mobile (if changed)
pnpm --filter admin check-types
pnpm --filter web check-types
pnpm --filter mobile check-types
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | JWT signing secret (min 16 chars, not a weak default in prod) |
| `VAULT_MASTER_KEY` or `ENCRYPTION_KEY` | Yes | Vault encryption key (64-char hex or >=32 chars) |
| `AUDIT_CHAIN_SECRET` | No | HMAC secret for audit log chain (falls back to `JWT_SECRET`) |
| `UPSTASH_REDIS_REST_URL` | No | Redis URL for OTP/session store |
| `UPSTASH_REDIS_REST_TOKEN` | No | Redis token |
| `SENTRY_DSN` | No | Sentry DSN for error tracking |
| `SENTRY_TRACES_SAMPLE_RATE` | No | Sentry trace sample rate (default: `0.1` prod, `1.0` dev) |
| `NODE_ENV` | No | `production` or `development` |

## Monitoring Notes

- **Sentry** is optional. Set `SENTRY_DSN` in production to enable error tracking.
- All PII/secret fields are scrubbed via `beforeSend` in `apps/api/src/instrument.ts`:
  - Strips `authorization`, `cookie`, `password`, `token`, `secret` headers.
  - Redacts request body fields containing `password`, `token`, `secret`, `apikey`, `api_key`.
- **Health check**: `GET /health` returns `{ status, checks: { database, redis, vault, timestamp } }`.
- **Rate limits** are applied per route in `AppModule.configure()`.

## Branch

Current hardening branch: `kilo/jovial-latch-ahe`
