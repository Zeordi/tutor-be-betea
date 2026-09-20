# Phase K — Final / Go-Live Readiness Gaps

Audited go-live readiness, cross-cutting concerns, and outstanding items on main branch.

## Existing Go-Live Readiness

| Area | Status | Details |
|------|--------|---------|
| Health endpoint | ✅ | `GET /health` checks database, Redis, vault |
| Boot secret validation | ✅ | `validateCriticalSecrets()` enforces JWT, vault key, DATABASE_URL in production |
| Rate limiting | ⚠️ Partial | Auth 5/min, payment 10/min, general 30/min — but limited route coverage |
| Error standardization | ✅ | `AllExceptionsFilter` returns consistent `{ success, statusCode, code, message, path, timestamp }` |
| Production error sanitization | ✅ | Stack/SQL/Prisma patterns stripped in production |
| Structured logging | ✅ | `StructuredLogger` emits JSON; `LoggingInterceptor` logs HTTP requests |
| Sentry integration | ✅ | Optional, with PII scrubbing in `beforeSend` |
| CORS configured | ✅ | `origin: true, credentials: true` |
| Webhook raw body | ✅ | `express.raw({ type: "application/json" })` for payment/escrow webhooks |
| Offline replay safety | ✅ | Idempotent via `offlineId`, validates timestamps, deduplicates |
| Audit chain | ✅ | HMAC-SHA256 chained logs for admin actions |
| Runbooks | ✅ | 5 runbooks covering backup, seed, secrets, observability, support |
| Go-live checklist | ✅ | `docs/go-live-checklist.md` |
| Rollout plan | ✅ | `docs/go-live-rollout-plan.md` with rollback conditions |

## Cross-Cutting Gaps from Prior Phases

These gaps were identified in Phases F-I and remain outstanding:

### From Phase F (Admin Wire)
1. **8 endpoint path mismatches** in `adminApi.ts` — vault, contracts, tickets, verification request-more/revoke all 404
2. **2 backend routes missing from adminApi.ts** — `flagRisk`, `childProfiles`
3. **7 static shells** in admin dashboard (RBAC, disputes, analytics, attendance, risk-flags, impersonation, promos)
4. **Role guard mismatch** — impersonation sidebar excludes support agents

### From Phase G (Money Rails)
5. **Parent escrow release blocked** — `POST /escrow/:id/release` requires SUPER_ADMIN/FINANCE, but parent UI calls it
6. **Reconcile endpoint missing role guard** — any authenticated user can reconcile any payment
7. **Stripe webhook endpoint missing** — `POST /payments/webhook/stripe` 404
8. **Duplicate Telebirr webhook** — both PaymentsController and EscrowController define it
9. **Payout request no provider check** — creates payout even if provider not configured

### From Phase H (Trust & Safety)
10. **Anti-poaching never blocks** — sanitizes but always sends message
11. **Chat Gateway no WebSocket auth** — unauthenticated connections allowed
12. **Geofence not enforced server-side** — check-in always succeeds even outside radius
13. **Teacher risk flag page broken** — calls admin-only `/risk-flags`
14. **Parent safety page broken** — calls non-existent `/disputes/mine`
15. **Parent support create static** — no API call to `POST /support`

### From Phase I (Hardening)
16. **Rate limiting limited** — only 6 routes covered
17. **In-memory rate limiter** — ineffective in multi-instance deploys
18. **Console.log used** in boot, Redis, Sentry init, WebSocket instead of structured logger
19. **Health endpoint unauthenticated** — information disclosure
20. **Operational exceptions not logged** — abuse patterns invisible

## Phase K-Specific Gaps

### 21. No deployment smoke test automation (MEDIUM)
- **File**: N/A
- **Issue**: `go-live-checklist.md` lists manual verification steps (OTP, payment, vault, attendance) but no automated smoke test script or CI job.
- **Impact**: Deploys may pass CI but fail critical paths in production.

### 22. No automated backup verification (LOW)
- **File**: `docs/runbooks/01-backup-restore.md`
- **Issue**: Runbook documents manual backup/restore but no automated test to verify backups are restorable.
- **Impact**: Backup corruption may not be detected until emergency restore.

### 23. No feature flags / kill switches (LOW)
- **File**: N/A
- **Issue**: No feature flag system for gradual rollout or emergency disable of risky features (payments, chat, verification).
- **Impact**: Cannot quickly disable a broken feature without a full deploy.

### 24. No API versioning strategy (LOW)
- **File**: N/A
- **Issue**: All routes are unversioned (`/payments`, `/contracts`, etc.). No `/v1/` prefix or version negotiation.
- **Impact**: Breaking changes will affect all clients simultaneously.

### 25. No rate limit for anonymous/public routes (LOW)
- **File**: `apps/api/src/app.module.ts`
- **Issue**: All rate limit middleware requires `JwtAuthGuard` implicitly (applied to authenticated routes). Public routes like `/auth/otp/send` are rate-limited, but any future public endpoint won't be.
- **Impact**: Public endpoints are vulnerable to abuse.

### 26. No request ID / correlation ID (LOW)
- **File**: N/A
- **Issue**: No `X-Request-ID` header generation or propagation. Logs have timestamp but no request correlation across services.
- **Impact**: Hard to trace a single user action across API, web, and mobile logs.

### 27. `next.config.ts` / web build may expose secrets (LOW)
- **File**: N/A (need to verify)
- **Issue**: If `NEXT_PUBLIC_*` variables contain sensitive data, they are baked into client bundles. `.env.example` shows `NEXT_PUBLIC_API_URL` etc. correctly, but no CI check enforces that `NEXT_PUBLIC_*` vars are non-sensitive.
- **Impact**: Accidental secret exposure in client bundles.

## Summary

- **1 MEDIUM**: No deployment smoke test automation
- **6 LOW**: No backup verification test, no feature flags, no API versioning, no anonymous rate limit, no request ID, no CI secret scan

### Outstanding Pre-Go-Live Blockers (from prior phases)
- Phase F: Admin API path mismatches (8 routes broken)
- Phase G: Parent escrow release role mismatch, Stripe webhook missing
- Phase H: Anti-poaching doesn't block, geofence not enforced, teacher risk flag page broken, parent safety page broken, parent support form static
- Phase I: Rate limiting incomplete, console.log used in critical paths, health endpoint unauthenticated

Total Phase K-specific: **7 gaps**
Total outstanding from F-I: **20 gaps**

**Recommendation**: Do not go live until at least the HIGH and MEDIUM gaps from Phases F-I are resolved (estimated 8-10 items). Phase K gaps can be addressed post-launch.
