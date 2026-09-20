# Phase K — Launch Ops Implementation Plan

**Branch**: `kilo/celestial-haven-jpr`  
**Date**: 2026-09-20  
**Scope**: Fix legal doc divergence, consent flows, and launch readiness gaps  
**Gaps**: 8 total (1 HIGH, 2 MEDIUM, 5 LOW)

---

## Priority 1 — Consolidate Legal Documents (Docs + Frontend)

### 1. Single source of truth for Privacy Policy and Terms
- **Files to update**:
  - `docs/PRIVACY_POLICY.md` → replace with symlink or redirect notice pointing to `docs/legal/privacy-policy.md`
  - `docs/TERMS_OF_SERVICE.md` → replace with symlink or redirect notice pointing to `docs/legal/terms-of-service.md`
  - `apps/web/app/(marketing)/privacy/page.tsx` → import and render the full text from `docs/legal/privacy-policy.md`
  - `apps/web/app/(marketing)/terms/page.tsx` → import and render the full text from `docs/legal/terms-of-service.md`
- **Why**: Three separate sources of truth exist. The `docs/legal/` versions are the most complete. Users viewing the web app see an abbreviated, older version.

### 2. Enforce canonical legal URLs in footer
- **File**: `apps/web/components/Footer.tsx:111-112`
- **Change**: Ensure footer links point to `/privacy` and `/terms` which now render the full `docs/legal/` versions.
- **Why**: Footer links are correct, but the pages they point to show abbreviated text.

---

## Priority 2 — Cookie Policy and Consent (Docs + Frontend)

### 3. Add cookie policy document and page
- **Files to create**:
  - `docs/legal/cookie-policy.md` — describe cookies used, purposes, retention, and how to disable
  - `apps/web/app/(marketing)/cookie-policy/page.tsx` — render the cookie policy
- **Also update** `apps/web/components/Footer.tsx:113` to link `/cookie-policy` instead of `/about`
- **Why**: "Cookie Policy" link goes to the generic About page; no cookie policy exists.

### 4. Add in-app terms acceptance to registration
- **Files to update**:
  - `apps/web/app/(auth)/register/page.tsx` (and mobile equivalent)
  - `apps/api/src/modules/auth/auth.service.ts` (or registration DTO)
- **Change**:
  1. Add a required checkbox: "I agree to the Terms of Service and Privacy Policy" with links to `/terms` and `/privacy`
  2. In the registration DTO, add `acceptedTermsAt: Date` and `acceptedPrivacyAt: Date`
  3. Store these timestamps on the `User` model
- **Why**: There is no evidence of terms acceptance during registration, weakening legal enforceability.

### 5. Add consent receipts to registration response
- **File**: `apps/api/src/modules/auth/auth.service.ts` (or registration handler)
- **Change**: Return `acceptedTermsAt`, `acceptedPrivacyAt`, and `termsVersion` in the registration response payload.
- **Why**: Needed for audit trail and GDPR compliance.

---

## Priority 3 — Launch Readiness Fixes (Docs + Config)

### 6. Fix `check-types` script reference in go-live checklist
- **File**: `docs/go-live-checklist.md`
- **Change**: Replace `pnpm check-types` with the correct workspace commands:
  ```bash
  pnpm --filter api check-types
  pnpm --filter admin check-types
  pnpm --filter web check-types
  pnpm --filter mobile check-types
  ```
- **Also add** `check-types` scripts to workspace package.json files if missing.
- **Why**: Root `package.json` may not have a `check-types` script.

### 7. Add Sentry fallback to rollout plan
- **File**: `docs/go-live-rollout-plan.md:15`
- **Change**: Change rollback condition from:
  ```
  Sentry error volume spikes >3x baseline
  ```
  to:
  ```
  (Sentry error volume spikes >3x baseline) OR (5xx error rate >2% in /health checks)
  ```
- **Why**: Sentry is optional; if not configured, the rollback trigger is blind.

### 8. Update beta feedback collection to use in-app support
- **File**: `docs/beta-program.md:29,34`
- **Change**: Replace Google Forms and WhatsApp references with the in-app `POST /support` endpoint using `reasonType: "FEEDBACK"`.
- **Why**: Feedback is scattered across external platforms instead of centralized in the admin dashboard.

---

## Summary

| Priority | Fixes | Docs changes | Code changes |
|----------|-------|--------------|--------------|
| 1 | #1-#2 (legal consolidation) | 2 root docs | 2 web pages + footer |
| 2 | #3-#5 (cookie policy, terms acceptance) | 1 new doc + 1 new page | 3 auth/registration files |
| 3 | #6-#8 (checklist, rollback, beta) | 3 docs | 0 |

**Estimated scope**:
- Priority 1 (legal docs): 2-3 hours
- Priority 2 (cookie policy + terms acceptance): 3-4 hours
- Priority 3 (launch readiness): 1 hour

**Total estimated effort**: 6-8 hours
