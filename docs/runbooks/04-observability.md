# Observability

## Key metrics

| Metric | Source | Alert threshold |
|--------|--------|-----------------|
| API 5xx error rate | Sentry / API logs | >5% over 5 min |
| API 429 rate-limit count | API logs | >100/min sustained |
| Auth failure rate | API logs (`Auth` context) | >20% over 10 min |
| Vault decrypt count | API logs (`Vault` context) | Unusual spike (>3x baseline) |
| Escrow auto-release count | API logs (`Escrow` context) | >10/hour |
| Offline sync replay count | API logs (`OfflineSync` context) | Spike with duplicate errors |
| Redis health key TTL | Health check | `tutor_be_betea_health` missing |

## Sentry alerts

- Group by `operation` tag when available.
- Alert on:
  - `INTERNAL_ERROR` with `NODE_ENV=production`
  - `RATE_LIMITED` bursts from single IP
  - `FORBIDDEN` on vault decrypt endpoint
  - `Escrow` release failures

## Redis alerting

- Monitor `tutor_be_betea_health` key TTL.
- If key expires without refresh, Redis connectivity is down.
- Alert via health check endpoint:
  ```bash
  curl -s http://localhost:4000/health | jq '.checks.redis'
  ```

## Dashboard layout (suggested)

1. **Top row**: API error rate (5xx), 429 count, auth success/failure
2. **Middle row**: Vault decrypt count, escrow release count, offline sync replay
3. **Bottom row**: Database connection pool, Redis latency, Sentry issue volume

## Log sampling

- In production, `StructuredLogger` emits JSON. Ship to a centralized log store (e.g. Datadog, Loki, CloudWatch).
- Sample rate:
  - `info` and above: 100%
  - `debug`: 0% in production, 100% in dev

## Runbook links

- [01-backup-restore.md](./01-backup-restore.md)
- [02-seed-and-reset.md](./02-seed-and-reset.md)
- [03-secret-rotation.md](./03-secret-rotation.md)
