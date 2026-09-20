# Phase G — Money Rails Implementation Plan

**Branch**: `kilo/celestial-haven-jpr`  
**Date**: 2026-09-20  
**Scope**: Fix payment, escrow, webhook, and payout flows  
**Gaps**: 8 total (1 HIGH, 2 MEDIUM, 5 LOW)

---

## Priority 1 — Fix Escrow Release Role Guard (Backend)

### 1. Allow parents to release escrow on their own contracts
- **File**: `apps/api/src/modules/escrow/escrow.controller.ts` (or `contracts.controller.ts`)
- **Change**: Update `@Roles` on `releaseFunds` / `releaseEscrow` from `SUPER_ADMIN, FINANCE` to `SUPER_ADMIN, FINANCE, PARENT`
- **Also update service**: In `EscrowService.releaseFunds` (or `ContractsService.releaseEscrow`), add a guard:
  ```ts
  const contract = await this.getContract(contractId);
  if (contract.parentId !== currentUser.id && !isAdmin(currentUser)) {
    throw new ForbiddenException("You can only release escrow on your own contracts");
  }
  ```
- **Why**: Parents viewing their own contracts get 403 when clicking "Request Release". The role guard is too restrictive.

---

## Priority 2 — Fix Missing Guards and Endpoints (Backend)

### 2. Add RolesGuard to reconcile endpoint
- **File**: `apps/api/src/modules/payments/payments.controller.ts:87-91`
- **Change**: Add `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles("SUPER_ADMIN", "FINANCE")` to `POST /payments/reconcile/:paymentId`
- **Why**: Any authenticated user can currently reconcile any payment by ID.

### 3. Add Stripe webhook endpoint
- **File**: `apps/api/src/modules/payments/payments.controller.ts`
- **Change**: Add handler:
  ```ts
  @Post("webhook/stripe")
  @Header("content-type", "application/json")
  stripeWebhook(@Req() req: Request) {
    return this.paymentsService.handleWebhook("stripe", req.rawBody, req.headers);
  }
  ```
- **Also update** `apps/api/src/main.ts` if needed to register `express.raw({ type: "application/json" })` for `/payments/webhook/stripe` (already registered for `/payments/webhook`).
- **Also update** `payment.config.ts` to ensure `stripe.webhookSecret` is set.
- **Why**: Stripe payments succeed but webhook events have nowhere to land, so payment status stays PENDING forever.

---

## Priority 3 — Fix Low-Priority Gaps (Backend + Frontend)

### 4. Remove duplicate Telebirr webhook
- **File**: `apps/api/src/modules/escrow/escrow.controller.ts:32-43`
- **Change**: Delete `POST /escrow/webhook/telebirr` handler from `EscrowController`. Keep only the one in `PaymentsController`.
- **Why**: Both controllers define the same path. Double-processing risk if both are registered.

### 5. Fix mobile redundant escrow hold call
- **File**: `apps/mobile/app/(parent)/contract/create.tsx:35-38`
- **Change**: Remove the explicit `POST /escrow/:id/hold` call after `POST /contracts`. The contract creation service already sets `escrowHeldAmount` and `status: PENDING_ESCROW`.
- **Why**: Extra network call; not broken but inefficient.

### 6. Fix mobile hardcoded payout provider
- **File**: `apps/mobile/app/(teacher)/earnings.tsx:73-77`
- **Change**: Replace `provider: "TELEBIRR"` with the teacher's actual payout method from `GET /users/me` → `payoutMethod`.
- **Why**: Teacher cannot withdraw via CBE_BIRR or MPESA even if configured.

### 7. Add provider config check to payout request
- **File**: `apps/api/src/modules/payments/payments.service.ts:341-401`
- **Change**: In `requestPayout`, before creating the payout record, call `isProviderConfigured(provider)` and throw `BadRequestException` if false.
- **Why**: If provider is not configured, payout sits in PENDING indefinitely with no early error.

### 8. Fix webhook idempotency for FAILED→SUCCESS transitions
- **File**: `apps/api/src/modules/payments/payments.service.ts:288-339`
- **Change**: Update the duplicate check logic:
  ```ts
  if (existing.status === "SUCCESS" && eventType === "payment_intent.succeeded") {
    return alreadyProcessed;
  }
  if (existing.status === "FAILED" && eventType === "payment_intent.failed") {
    return alreadyProcessed;
  }
  ```
  Do NOT block SUCCESS events if the current status is FAILED.
- **Why**: Provider retries or status corrections should be allowed to transition from FAILED to SUCCESS.

---

## Summary

| Priority | Fixes | Backend changes | Frontend changes |
|----------|-------|-----------------|------------------|
| 1 | #1 (escrow roles) | 2 files | 0 |
| 2 | #2-#3 (guard + Stripe webhook) | 2 files | 0 |
| 3 | #4-#8 (duplicate webhook, mobile fixes, idempotency) | 2 files | 2 files |

**Estimated scope**:
- Priority 1 (escrow role fix): 1 hour
- Priority 2 (guard + Stripe webhook): 1-2 hours
- Priority 3 (low-priority fixes): 2-3 hours

**Total estimated effort**: 4-6 hours
