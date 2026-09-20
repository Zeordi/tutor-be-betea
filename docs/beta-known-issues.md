# Beta Known Issues

This document lists known gaps and limitations active during the beta period.

## Verification

- **No real ID-vendor API:** Fayda National ID and university registrar verification are not automated. Admin manual review only.
- **No real liveness detection:** Selfie uploads are reviewed manually; no automated liveness check is performed.

## Payments

- **Stripe payouts not live:** Stripe payout integration is not yet production-ready. Manual payout via Telebirr or CBE Birr only.
- **Payment provider keys required:** Telebirr, CBE Birr, and M-Pesa credentials must be configured for payments to function.
- **SMS provider required:** OTP delivery depends on configured SMS provider. Without valid credentials, SMS fails silently in production.

## Observability

- **Sentry optional:** Error tracking is disabled unless `SENTRY_DSN` is set.
- **Redis required for OTP:** `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` must be configured in production. Memory fallback works only for single-instance dev environments.

## Platform

- **Web app not optimized for mobile browsers:** The admin and web interfaces are designed for desktop. Mobile browser experience may be degraded.

## References

- [beta-program.md](./beta-program.md)
- [BETA_LAUNCH_CHECKLIST.md](./BETA_LAUNCH_CHECKLIST.md)
