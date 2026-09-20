# Phase F — Admin Wire Implementation Plan

**Branch**: `kilo/celestial-haven-jpr`  
**Date**: 2026-09-20  
**Scope**: Fix admin dashboard pages to use live backend data  
**Gaps**: 20 total (12 HIGH, 7 MEDIUM, 1 LOW)

---

## Priority 1 — Fix adminApi.ts Endpoint Paths (Frontend Only)

These are pure path corrections; no backend changes required.

### 1. Fix vault endpoints
- **File**: `apps/admin/lib/adminApi.ts`
- **Changes**:
  1. `vaultPending()`: `/vault/pending` → `/admin/vault/pending`
  2. `vaultTeacherDocuments(id)`: `/vault/teacher/${id}` → `/admin/vault/teacher/${id}`
  3. `vaultDecrypt(documentId)`: `/vault/${id}/decrypt` → `/admin/vault/${id}/decrypt`
- **Why**: All vault backend routes are prefixed with `/admin`. Current paths return 404.

### 2. Fix contracts endpoint
- **File**: `apps/admin/lib/adminApi.ts`
- **Change**: `contracts()`: `/contracts` → `/admin/contracts`
- **Why**: Backend route is `/admin/contracts`.

### 3. Fix support/ticket endpoints
- **File**: `apps/admin/lib/adminApi.ts`
- **Changes**:
  1. `tickets()`: `/support` → `/admin/support`
  2. `ticket(id)`: `/support/${id}` → `/admin/support/${id}`
- **Why**: Backend routes are `/admin/support` and `/admin/support/:id`.

### 4. Fix verification endpoints
- **File**: `apps/admin/lib/adminApi.ts`
- **Changes**:
  1. `requestMoreVerification(documentId, reason)`: `/verification/${id}/request-more` → `/admin/verification/${id}/request-more`
  2. `revokeVerification(documentId, reason)`: `/verification/${id}/revoke` → `/admin/verification/${id}/revoke`
- **Why**: Backend routes are under `/admin/verification`.

---

## Priority 2 — Add Missing adminApi.ts Methods (Frontend Only)

### 5. Add `flagRisk` to adminApi.ts
- **File**: `apps/admin/lib/adminApi.ts`
- **Change**: Add method:
  ```ts
  flagRisk: (userId: string, reason: string) =>
    apiFetch<{ id: string }>(`/admin/risk-flag/${userId}`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
  ```
- **Why**: Backend has `POST /admin/risk-flag/:userId` but no frontend client method.

### 6. Add `childProfiles` to adminApi.ts
- **File**: `apps/admin/lib/adminApi.ts`
- **Change**: Add method:
  ```ts
  childProfiles: (parentId: string) =>
    apiFetch<ChildProfile[]>(`/admin/children/${parentId}`),
  ```
- **Why**: Backend has `GET /admin/children/:parentId` but no frontend client method.

---

## Priority 3 — Fix Role Guard Mismatch (Frontend Only)

### 7. Update impersonation sidebar role guard
- **File**: `apps/admin/app/dashboard/impersonation/page.tsx` (or equivalent sidebar config)
- **Change**: Update sidebar role config for `/dashboard/impersonation` from `super only` to `super, support`
- **Why**: Backend allows `SUPER_ADMIN` and `SUPPORT_AGENT`, but the sidebar hides the page from support agents.

---

## Priority 4 — Wire Static Shells (Frontend + Backend)

### 8. Wire RBAC management page
- **File**: `apps/admin/app/dashboard/rbac/page.tsx`
- **Backend needed**: Verify `/admin/rbac` or `/admin/roles` endpoints exist
- **Change**: Replace static shell with live fetch of admin users and their roles
- **Why**: Currently shows only the current admin session with a "not yet exposed" message.

### 9. Wire disputes page
- **File**: `apps/admin/app/dashboard/disputes/page.tsx`
- **Backend needed**: Verify `/admin/disputes` endpoint or reuse `/admin/support` with `?type=DISPUTE`
- **Change**: Replace reused support tickets with dedicated dispute model. Wire action buttons (Release to Tutor, Refund Parent, Escalate) to backend dispute endpoints.
- **Why**: Action buttons are all disabled; no dispute model exists.

### 10. Wire analytics page
- **File**: `apps/admin/app/dashboard/analytics/page.tsx`
- **Backend needed**: `GET /admin/analytics` or reuse existing metrics endpoints
- **Change**: Replace static "Charts panel" with live data fetch
- **Why**: Currently shows placeholder text.

### 11. Wire attendance page
- **File**: `apps/admin/app/dashboard/attendance/page.tsx`
- **Backend needed**: `GET /admin/attendance` with geo data, or reuse `GET /attendance/contract/:contractId`
- **Change**: Replace static "Live geo map panel" with real session point data from PostGIS
- **Why**: Currently shows placeholder text.

### 12. Wire risk-flags page action buttons
- **File**: `apps/admin/app/dashboard/risk-flags/page.tsx`
- **Backend needed**: `POST /admin/risk-flags/:id/suspend` and `POST /admin/risk-flags/:id/warn` (verify if they exist)
- **Change**: Wire "Suspend" and "Warn" buttons to their respective API calls
- **Why**: Only "Clear" works; the other buttons are disabled.

### 13. Wire impersonation audit log
- **File**: `apps/admin/app/dashboard/impersonation/page.tsx`
- **Backend needed**: `GET /admin/audit/impersonation` or similar
- **Change**: Replace hardcoded `Yared Bekele` entries with real audit log fetch
- **Why**: Static data is misleading.

### 14. Wire promos page
- **File**: `apps/admin/app/dashboard/promos/page.tsx`
- **Backend needed**: `GET /admin/promos` and `POST /admin/promos`
- **Change**: Replace hardcoded `BANNERS` array with API fetch and create/update forms
- **Why**: Static data does not reflect real promos.

---

## Summary

| Priority | Fixes | Backend changes | Frontend changes |
|----------|-------|-----------------|------------------|
| 1 | #1-#4 (path fixes) | 0 | 1 file (`adminApi.ts`) |
| 2 | #5-#6 (missing methods) | 0 | 1 file (`adminApi.ts`) |
| 3 | #7 (role guard) | 0 | 1 page |
| 4 | #8-#14 (static shells) | 0-7 new endpoints | 7 pages |

**Estimated scope**:
- Priority 1-2 (adminApi.ts fixes): 1-2 hours
- Priority 3 (role guard): 15 mins
- Priority 4 (wire static shells): 4-6 hours (depends on backend endpoint availability)

**Total estimated effort**: 6-9 hours
