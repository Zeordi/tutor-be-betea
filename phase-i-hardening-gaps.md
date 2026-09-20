# Phase I — Hardening Gaps

Audited boot validation, health, rate limits, error handling, offline replay, logging, Sentry, and runbooks on main branch.

## Existing Hardening (Working)

| Area | Status | Details |
|------|--------|---------|
| Boot secret validation | ✅ | `env.validation.ts` validates `JWT_SECRET` (>=16 chars, not weak), `VAULT_MASTER_KEY`/`ENCRYPTION_KEY` (64-char hex or >=32 chars), `DATABASE_URL` in production |
| GET /health | ✅ | Checks database (`SELECT 1`), Redis (ping), vault key (`getVaultKey()`). Returns `ok` or `degraded` |
| Rate limits | ⚠️ Partial | Auth (5/min), Payment (10/min), General (30/min) — but only applied to a handful of routes |
| Consistent errors | ✅ | `AllExceptionsFilter` standardizes `{ success, statusCode, code, message, path, timestamp }`. Sanitizes stack/SQL/Prisma patterns in production |
| Offline replay safety | ✅ | `offline-sync.service.ts` validates `offlineId` format, `clientCreatedAt` freshness (<24h), idempotent via unique `offlineId`, rejects duplicate active check-ins |
| Structured logging | ✅ | `StructuredLogger` emits JSON with timestamp/level/event/context/metadata. `LoggingInterceptor` logs HTTP method/path/duration |
| Optional Sentry | ✅ | `instrument.ts` initializes Sentry if `SENTRY_DSN` set. `beforeSend` scrubs `authorization`, `cookie`, `password`, `token`, `secret` headers and body fields |
| Runbooks | ✅ | 5 runbooks exist: backup-restore, seed-and-reset, secret-rotation, observability, support-process |

## Gaps

### 1. Rate limiting covers only 6 routes — vast attack surface unprotected (HIGH)
- **File**: `apps/api/src/app.module.ts:94-113`
- **Issue**: `AuthRateLimitMiddleware` applied to 4 auth routes + 1 verification route. `PaymentRateLimitMiddleware` applied to only `POST /payments/initiate`. `GeneralRateLimitMiddleware` applied to 3 routes. All other endpoints (chat, support, contracts, jobs, attendance, offline sync, etc.) have **no rate limiting**.
- **Impact**: Brute-force, scraping, and abuse attacks possible on unprotected endpoints.

### 2. In-memory rate limiter breaks in multi-instance deploys (HIGH)
- **File**: `apps/api/src/common/middleware/simple-rate-limit.middleware.ts:10-11`
- **Issue**: Uses `Map<string, Bucket>` in process memory. On Render/AWS with multiple instances, each instance tracks its own counters, allowing attackers to bypass limits by hitting different instances.
- **Impact**: Rate limiting is ineffective in production multi-instance deploys.

### 3. `console.warn`/`console.error` used instead of structured logger (MEDIUM)
- **File**: `apps/api/src/config/env.validation.ts:26,36,46,53`, `apps/api/src/config/redis.ts:12,15`, `apps/api/src/instrument.ts:55,57`, `apps/api/src/modules/chat/chat.gateway.ts:29`
- **Issue**: Boot validation, Redis connection, Sentry init, and WebSocket connections use raw `console.warn`/`console.error`/`console.log` instead of `StructuredLogger`.
- **Impact**: These events are not captured in structured JSON logs, breaking centralized log aggregation and correlation.

### 4. Health endpoint has no auth guard — may leak internal state (MEDIUM)
- **File**: `apps/api/src/common/health/health.controller.ts:17`
- **Issue**: `GET /health` is unauthenticated and returns detailed checks including database status, redis status, and vault key validity. This is a common reconnaissance target.
- **Impact**: Information disclosure — attackers can determine internal service health and configuration state.

### 5. OperationalException not logged at error level by AllExceptionsFilter (MEDIUM)
- **File**: `apps/api/src/common/filters/http-exception.filter.ts:62-65`
- **Issue**: `OperationalException` (used for business rule violations like invalid offlineId, duplicate attendance, etc.) is caught but never logged. Only `HttpException` and generic `Error` are logged.
- **Impact**: Operational errors (potential abuse patterns) are invisible in logs.

### 6. No rate limiting on offline sync endpoint (LOW)
- **File**: `apps/api/src/modules/offline-sync/offline-sync.controller.ts:12`, `apps/api/src/app.module.ts:111`
- **Issue**: `POST /offline/attendance` is rate-limited (GeneralRateLimitMiddleware), but `POST /offline/progress` and `POST /offline/support` are **not** rate-limited.
- **Impact**: A teacher could flood progress reports or support tickets from offline queue.

### 7. Stripe webhook path registered as raw express but missing in PaymentsController (LOW)
- **File**: `apps/api/src/main.ts:34-35`, `apps/api/src/modules/payments/payments.controller.ts`
- **Issue**: `app.use("/payments/webhook", express.raw(...))` is registered in main.ts, but `PaymentsController` has no `@Post("webhook/stripe")` handler. The raw body middleware is ready but unused for Stripe.
- **Impact**: Stripe webhooks will 404; payment status stays PENDING.

### 8. No request timeout / circuit breaker for external payment providers (LOW)
- **File**: `apps/api/src/config/payment.config.ts:114-221`
- **Issue**: `requestTelebirrCheckout`, `requestCbeBirrCheckout`, `requestMpesaCheckout` use raw `fetch` with no timeout. If a provider hangs, the API request hangs until the default fetch timeout (often 5+ minutes).
- **Impact**: Hanging payment requests can exhaust API worker threads.

### 9. `StructuredLogger` uses `JSON.stringify` but NestJS `Logger` may add extra formatting (LOW)
- **File**: `apps/api/src/common/logging/logger.service.ts:31`
- **Issue**: `format()` returns `JSON.stringify(payload)`, but `Logger.log/warn/error` may wrap the string with timestamp/context prefixes depending on NestJS configuration, producing mixed log formats.
- **Impact**: Log parsers expecting pure JSON may fail to parse.

### 10. No production smoke test / deployment verification script (LOW)
- **File**: N/A
- **Issue**: Runbooks cover backup, seed, secrets, and observability, but there's no documented smoke test to verify a deploy succeeded (e.g., `curl /health && curl /auth/otp/send` with a test number).
- **Impact**: Bad deploys may not be detected immediately.

## Summary

- **2 HIGH**: Rate limiting covers only 6 routes; in-memory rate limiter ineffective in multi-instance deploys
- **3 MEDIUM**: Raw console used instead of structured logger; health endpoint unauthenticated; operational exceptions not logged
- **5 LOW**: Offline progress/support not rate-limited; Stripe webhook missing; no fetch timeout for providers; JSON log formatting edge case; no deployment smoke test

Total: **10 gaps**
