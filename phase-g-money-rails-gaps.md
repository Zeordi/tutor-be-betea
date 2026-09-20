# Phase G — Money Rails Gaps

Audited payments, escrow, checkout, wallet, earnings, and payout flows on main branch.

## Backend Endpoint Audit

| Endpoint | Method | Roles | Status |
|----------|--------|-------|--------|
| `POST /payments/initiate` | POST | PARENT | ✅ Exists |
| `POST /payments/payout` | POST | TEACHER | ✅ Exists |
| `GET /payments/wallet` | GET | PARENT | ✅ Exists |
| `GET /payments/earnings` | GET | TEACHER | ✅ Exists |
| `POST /payments/reconcile/:paymentId` | POST | JwtAuthGuard only | ⚠️ No RolesGuard |
| `GET /payments/status/:paymentId` | GET | JwtAuthGuard | ✅ Exists |
| `GET /payments/status/check` | GET | None (public) | ✅ Exists |
| `POST /payments/webhook/telebirr` | POST | None (webhook) | ✅ Exists |
| `POST /payments/webhook/cbe` | POST | None (webhook) | ✅ Exists |
| `POST /payments/webhook/mpesa` | POST | None (webhook) | ✅ Exists |
| `POST /payments/webhook/stripe` | POST | None (webhook) | ❌ Missing |
| `POST /escrow/:contractId/hold` | POST | PARENT | ✅ Exists |
| `POST /escrow/:contractId/release` | POST | SUPER_ADMIN, FINANCE | ✅ Exists |
| `POST /escrow/auto-release` | POST | SUPER_ADMIN, FINANCE | ✅ Exists |
| `POST /escrow/webhook/telebirr` | POST | None (webhook) | ⚠️ Duplicate |
| `POST /contracts/:id/release` | POST | SUPER_ADMIN, FINANCE | ✅ Exists |

## Gaps

### 1. Parent escrow release blocked by role guard (HIGH)
- **File**: `apps/web/app/parent/contracts/page.tsx:48`
- **Issue**: `handleRelease` calls `POST /escrow/:id/release` which requires `SUPER_ADMIN` or `FINANCE`. Parents viewing their own contracts get 403 Forbidden.
- **Backend**: `EscrowController.releaseFunds` and `ContractsController.releaseEscrow` both restricted to admin/finance roles.
- **Impact**: "Request Release" button is non-functional for the intended user (parent).

### 2. Reconcile endpoint missing role guard (MEDIUM)
- **File**: `apps/api/src/modules/payments/payments.controller.ts:87-91`
- **Issue**: `POST /payments/reconcile/:paymentId` only has `JwtAuthGuard`, no `RolesGuard`. Any authenticated user can reconcile any payment by ID.
- **Impact**: Security — users can trigger reconciliation on payments that don't belong to them.

### 3. Stripe webhook endpoint missing (MEDIUM)
- **File**: `apps/api/src/modules/payments/payments.controller.ts`
- **Issue**: Webhook handlers exist for Telebirr, CBE Birr, and M-Pesa, but no `POST /payments/webhook/stripe`. `payment.config.ts` includes Stripe config with `webhookSecret`.
- **Impact**: Stripe payments will succeed (PaymentIntent created) but webhook events (e.g., `payment_intent.succeeded`) have nowhere to land, so payment status stays PENDING forever.

### 4. Duplicate Telebirr webhook endpoints (LOW)
- **File**: `apps/api/src/modules/payments/payments.controller.ts:51-59` and `apps/api/src/modules/escrow/escrow.controller.ts:32-43`
- **Issue**: Both controllers define `POST /payments/webhook/telebirr` and `POST /escrow/webhook/telebirr`. The escrow webhook only sets contract status to ACTIVE, while the payments webhook updates payment status AND contract status.
- **Impact**: Double-processing risk if both endpoints are registered. The escrow webhook path `/escrow/webhook/telebirr` is not standard and may confuse provider configuration.

### 5. Mobile contract creation makes redundant escrow hold call (LOW)
- **File**: `apps/mobile/app/(parent)/contract/create.tsx:35-38`
- **Issue**: After `POST /contracts`, mobile calls `POST /escrow/:id/hold`. But `ContractsService.createContract` already sets `escrowHeldAmount: data.agreedAmount` and `status: PENDING_ESCROW`. The `holdFunds` call sets the same values again.
- **Impact**: Extra network call, not broken but inefficient.

### 6. Mobile "Withdraw All" hardcodes TELEBIRR (LOW)
- **File**: `apps/mobile/app/(teacher)/earnings.tsx:73-77`
- **Issue**: `handleWithdrawAll` sends `provider: "TELEBIRR"` hardcoded, ignoring teacher's actual payout method preference.
- **Impact**: Teacher cannot withdraw All via CBE_BIRR or MPESA even if configured.

### 7. Payout request doesn't verify provider is configured (LOW)
- **File**: `apps/api/src/modules/payments/payments.service.ts:341-401`
- **Issue**: `requestPayout` creates a payout record without checking `isProviderConfigured(provider)`. If provider is not configured, payout sits in PENDING indefinitely with no early error.
- **Impact**: Silent failure — teacher thinks payout was requested but it will never process.

### 8. Webhook idempotency gap for FAILED→SUCCESS transitions (LOW)
- **File**: `apps/api/src/modules/payments/payments.service.ts:288-339`
- **Issue**: `handleWebhook` only blocks duplicate SUCCESS (`if (existing.status === "SUCCESS") return alreadyProcessed`). If provider sends FAILED then later sends SUCCESS, the second webhook will overwrite status to SUCCESS.
- **Impact**: Rare, but possible with provider retries or status corrections.

## Summary

- **1 HIGH**: Parent escrow release blocked by role guard
- **1 MEDIUM**: Reconcile endpoint missing role guard
- **1 MEDIUM**: Stripe webhook endpoint missing
- **1 LOW**: Duplicate Telebirr webhook endpoints
- **1 LOW**: Redundant mobile escrow hold call
- **1 LOW**: Mobile withdraw all hardcodes provider
- **1 LOW**: Payout request doesn't check provider config
- **1 LOW**: Webhook idempotency edge case

Total: **8 gaps**
