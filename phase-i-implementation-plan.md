# Phase I — Hardening Implementation Plan

**Branch**: `kilo/celestial-haven-jpr`  
**Date**: 2026-09-20  
**Scope**: Fix rate limiting, logging, timeouts, and operational gaps  
**Gaps**: 10 total (2 HIGH, 3 MEDIUM, 5 LOW)

---

## Priority 1 — Rate Limiting (Backend)

### 1. Expand rate limiting coverage to all public/auth routes
- **File**: `apps/api/src/app.module.ts:94-113`
- **Change**: Apply `AuthRateLimitMiddleware` to all auth-related routes (OTP, register, login, refresh). Apply `GeneralRateLimitMiddleware` to all remaining public and protected routes. Remove the current whitelist approach and instead use a global rate limiter with per-route overrides.
- **Why**: Only 6 routes are currently rate-limited; the rest of the API is unprotected against brute-force and scraping.

### 2. Replace in-memory rate limiter with Redis store
- **File**: `apps/api/src/common/middleware/simple-rate-limit.middleware.ts`
- **Change**: Replace `Map<string, Bucket>` with Redis-backed rate limiting using `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Use a sliding window algorithm keyed by IP + route.
- **Fallback**: If Redis is unavailable, fall back to in-memory with a warning log.
- **Why**: In-memory counters are per-instance; multi-instance deploys allow attackers to bypass limits by hitting different instances.

---

## Priority 2 — Logging, Health, and Error Handling (Backend)

### 3. Replace raw console with StructuredLogger
- **Files**:
  - `apps/api/src/config/env.validation.ts`
  - `apps/api/src/config/redis.ts`
  - `apps/api/src/instrument.ts`
  - `apps/api/src/modules/chat/chat.gateway.ts`
- **Change**: Replace `console.warn`, `console.error`, `console.log` with `this.logger.warn()`, `this.logger.error()`, `this.logger.log()` from `StructuredLogger`.
- **Why**: These events are not captured in structured JSON logs, breaking centralized log aggregation.

### 4. Add auth guard to health endpoint or limit info disclosure
- **File**: `apps/api/src/common/health/health.controller.ts:17`
- **Change**: Option A: Add `@UseGuards(JwtAuthGuard)` to `GET /health`. Option B: Return only `{ status: "ok" }` for unauthenticated requests; detailed checks only for authenticated admin requests.
- **Why**: Unauthenticated health endpoint leaks internal service state (database status, redis status, vault key validity).

### 5. Log OperationalException in AllExceptionsFilter
- **File**: `apps/api/src/common/filters/http-exception.filter.ts:62-65`
- **Change**: Add a catch block for `OperationalException`:
  ```ts
  catch (const exception) {
    if (exception instanceof OperationalException) {
      this.logger.warn(`Operational: ${exception.message}`, exception.stack);
    }
    // ... existing logic
  }
  ```
- **Why**: Operational errors (business rule violations) are invisible in logs.

---

## Priority 3 — Timeouts, Webhooks, and Smoke Tests (Backend)

### 6. Add fetch timeout for external payment providers
- **File**: `apps/api/src/config/payment.config.ts:114-221`
- **Change**: Wrap `fetch` calls with `AbortController` and a 10-second timeout:
  ```ts
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  const response = await fetch(url, { signal: controller.signal, ... });
  clearTimeout(timeout);
  ```
- **Why**: Provider hangs can exhaust API worker threads.

### 7. Add Stripe webhook handler to PaymentsController
- **File**: `apps/api/src/modules/payments/payments.controller.ts`
- **Change**: Add `@Post("webhook/stripe")` with `@Header("content-type", "application/json")` and `express.raw` middleware in `main.ts` (already registered). This also resolves the Phase I gap #7.
- **Why**: Stripe webhooks currently 404; payment status stays PENDING.

### 8. Add production smoke test script
- **File to create**: `scripts/smoke-test.sh`
- **Contents**:
  ```bash
  #!/bin/bash
  set -e
  echo "Checking /health..."
  curl -s -f "$API_URL/health" | jq .
  echo "Checking auth endpoint..."
  curl -s -f -X POST "$API_URL/auth/otp/send" -H "Content-Type: application/json" -d '{"phone":"+251911000000"}' | jq .
  echo "Smoke test passed"
  ```
- **Also add** `smoke-test` script to root `package.json`.
- **Why**: No documented way to verify a deploy succeeded.

### 9. Fix JSON log formatting
- **File**: `apps/api/src/common/logging/logger.service.ts:31`
- **Change**: Ensure `format()` returns a pure JSON string without extra NestJS `Logger` wrapping. Use `this.logger.log(JSON.stringify(payload))` instead of relying on NestJS formatting.
- **Why**: Mixed log formats break centralized log parsers.

### 10. Add rate limiting to offline progress and support endpoints
- **File**: `apps/api/src/modules/offline-sync/offline-sync.controller.ts`
- **Change**: Apply `GeneralRateLimitMiddleware` to `POST /offline/progress` and `POST /offline/support`.
- **Why**: A teacher could flood progress reports or support tickets from offline queue.

---

## Summary

| Priority | Fixes | Backend changes | Frontend changes |
|----------|-------|-----------------|------------------|
| 1 | #1-#2 (rate limiting) | 2 files | 0 |
| 2 | #3-#5 (logging, health, errors) | 4 files | 0 |
| 3 | #6-#10 (timeouts, webhooks, smoke test, logs) | 5 files | 0 |

**Estimated scope**:
- Priority 1 (rate limiting): 3-4 hours
- Priority 2 (logging + health + errors): 2-3 hours
- Priority 3 (timeouts + webhook + smoke test): 2-3 hours

**Total estimated effort**: 7-10 hours
