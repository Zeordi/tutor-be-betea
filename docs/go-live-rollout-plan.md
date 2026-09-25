# Go-Live Rollout Plan

## Phased Rollout

- **Day 1:** 10% of beta users
- **Day 3:** 50% if no issues
- **Day 7:** 100% of beta users

## Rollback Conditions

Roll back to previous release if any of the following occur:

- >10% 5xx error rate over a 15-minute window
- Health check endpoint returns degraded status
- Sentry error volume spikes >3x baseline within 1 hour (only if `SENTRY_DSN` is configured)
- If Sentry is not configured, use application error rate from health checks or logs as the equivalent signal

## Pre-Rollback Steps

1. Pause further traffic shifting
2. Notify on-call team
3. Revert to last known good deploy
4. Investigate using Phase I observability runbook `04-observability.md`

## References

- [go-live-checklist.md](./go-live-checklist.md)
- [04-observability.md](./runbooks/04-observability.md)
- [01-backup-restore.md](./runbooks/01-backup-restore.md)
