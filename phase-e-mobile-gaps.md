# Phase E — Mobile Wire Audit Summary

**Branch**: `kilo/celestial-haven-jpr`  
**Date**: 2026-09-20  
**Status**: Mobile shell is complete; most screens are static or miswired

## Existing Mobile (Working)

| Area | Status | Details |
|------|--------|---------|
| `lib/api.ts` | ✅ | `apiRequest<T>` with SecureStore token, JSON headers, error throwing |
| `lib/api.ts` paths | ✅ | Canonical path constants for contracts, payments, jobs, etc. |
| Auth layouts | ⚠️ Partial | Tab layouts exist but do not check auth or redirect to login |
| Parent/teacher shells | ✅ | Tab navigations, theme provider, shared components exist |

## Gaps

### 1. Parent Job Detail — Applicants endpoint 404
- **File**: `apps/mobile/app/(parent)/job/[id].tsx:47`
- **Issue**: Calls `GET /jobs/${id}/applications` inline in `Promise.all`
- **Expected**: Backend has no `/jobs/:id/applications` route
- **Fix**: Remove applicants tab from mobile parent job detail or add backend route

### 2. Parent Subscription Plans — 404
- **File**: `apps/mobile/app/(parent)/subscription.tsx:42`
- **Issue**: Calls `GET /subscriptions/plans`
- **Expected**: Backend `SubscriptionsController` only has `/mine` and `/upgrade`
- **Fix**: Add `GET /subscriptions/plans` to backend or remove plans list from mobile

### 3. Parent Booking — Static Shell
- **File**: `apps/mobile/app/(parent)/booking.tsx`
- **Issue**: No API calls; hardcoded tutor name, package, prices, payment methods
- **Expected**: Should create contract, fund escrow, initiate payment
- **Fix**: Wire to `POST /contracts`, `POST /escrow/:id/hold`, `POST /payments/initiate`

### 4. Parent Calendar — Static Shell
- **File**: `apps/mobile/app/(parent)/calendar.tsx`
- **Issue**: Hardcoded `DAYS` and `SLOTS`; no fetch
- **Expected**: Should fetch teacher availability or slots
- **Fix**: Wire to availability API or teacher schedule endpoint

### 5. Parent Notification Settings — Static Shell
- **File**: `apps/mobile/app/(parent)/notification-settings.tsx`
- **Issue**: Local state toggles only; no API persistence
- **Expected**: Should persist preferences via API
- **Fix**: Add notification settings endpoint or wire to user preferences

### 6. Parent Replacement — Static Shell
- **File**: `apps/mobile/app/(parent)/replacement.tsx`
- **Issue**: `Alert.alert("Submitted", ...)` on submit; no API call
- **Expected**: Should call `POST /replacements`
- **Fix**: Wire submit to `POST /replacements` with `contractId` and `reason`

### 7. Parent Messages — Static Shell
- **File**: `apps/mobile/app/(parent)/(tabs)/messages.tsx`
- **Issue**: "No chat rooms endpoint wired yet"
- **Expected**: Should show list of conversations/rooms
- **Fix**: Add backend chat rooms list endpoint or use existing chat infrastructure

### 8. Teacher Jobs — Wrong Endpoint (Role Mismatch)
- **File**: `apps/mobile/app/(teacher)/(tabs)/jobs.tsx:45`
- **Issue**: Calls `GET /jobs/mine` which is `@Roles("PARENT")`
- **Expected**: Teachers should call `GET /jobs/open`
- **Fix**: Change to `"/jobs/open"`

### 9. Teacher Applications — 404
- **File**: `apps/mobile/app/(teacher)/applications.tsx:43`
- **Issue**: Calls `GET /applications/mine`
- **Expected**: Backend has no `/applications/mine`; teacher apps are under `/jobs/applications/mine`
- **Fix**: Change to `"/jobs/applications/mine"`

### 10. Teacher Apply — Wrong Endpoint (2 files)
- **Files**: 
  - `apps/mobile/app/(teacher)/apply/[jobId].tsx:57`
  - `apps/mobile/app/(teacher)/job/[id].tsx:75`
- **Issue**: `POST /applications` with `{ jobId }`
- **Expected**: Backend has `POST /jobs/:jobId/apply`
- **Fix**: Change to `POST /jobs/${jobId}/apply` with `{ coverNote }`

### 11. Teacher Analytics — Static Shell
- **File**: `apps/mobile/app/(teacher)/analytics.tsx`
- **Issue**: Hardcoded metrics; no fetch
- **Expected**: Needs teacher analytics endpoint
- **Fix**: Add `/analytics/mine` backend or remove static shell

### 12. Teacher Messages — Static Shell
- **File**: `apps/mobile/app/(teacher)/(tabs)/messages.tsx`
- **Issue**: Same as #7 — no chat rooms list endpoint
- **Expected**: Should show conversation list
- **Fix**: Same as #7

### 13. Teacher Onboarding — Static Shell
- **File**: `apps/mobile/app/(teacher)/onboarding.tsx`
- **Issue**: Hardcoded `STEPS` array; no API
- **Expected**: Should fetch onboarding progress from backend
- **Fix**: Add onboarding progress endpoint or remove static shell

### 14. Teacher Risk Flag — Static Shell
- **File**: `apps/mobile/app/(teacher)/risk-flag.tsx`
- **Issue**: Hardcoded flag data and timeline
- **Expected**: Should fetch from `/risk-flags/mine` or similar
- **Fix**: Add risk flags endpoint or remove static shell

### 15. Parent Contract Create — Potential Escrow Gap
- **File**: `apps/mobile/app/(parent)/contract/create.tsx:35-38`
- **Issue**: Calls `POST /escrow/:id/hold` after contract creation
- **Expected**: Backend `ContractsController` has no escrow hold endpoint
- **Fix**: Verify escrow flow is handled internally or add endpoint

### 16. Auth Guard Gaps (Phase A, still open)
- **Files**:
  - `apps/mobile/app/(parent)/(tabs)/_layout.tsx`
  - `apps/mobile/app/(teacher)/(tabs)/_layout.tsx`
- **Issue**: Missing auth redirect if no token
- **Fix**: Add token check and redirect to login

### 17. Inline Fetch Bypassing `apiRequest` (4 additional files)
- **Files**:
  - `apps/mobile/app/(parent)/children/add.tsx:26`
  - `apps/mobile/app/(teacher)/location.tsx:47`
  - `apps/mobile/hooks/usePushNotifications.ts:67`
  - `apps/mobile/app/(shared)/notifications.tsx:24`
  - `apps/mobile/lib/video/index.ts:19`
- **Issue**: Uses raw `fetch` with hardcoded `process.env.EXPO_PUBLIC_API_URL` instead of `apiRequest` from `lib/api.ts`
- **Fix**: Refactor to use canonical `apiRequest` from `lib/api.ts`

### 18. Mobile `paths` contains non-existent or wrong routes
- **File**: `apps/mobile/lib/api.ts:29, 49-52`
- **Issue**:
  - `jobsMine: "/jobs/mine"` — this route is `@Roles("PARENT")`; teachers calling it get 403
  - `applicationsMine: "/applications/mine"` — no such controller exists
  - `applicationsAction` / `applicationsCreate` — no such controllers exist
- **Fix**: Remove or correct these paths to match backend (`/jobs/open`, `/jobs/applications/mine`, `/jobs/:jobId/apply`).

## Summary

- **404/endpoint mismatches**: 7 (#1, #2, #8, #9, #10, #15, #18)
- **Static shells**: 7 (#3, #4, #5, #6, #11, #13, #14)
- **Shared gaps**: 2 (#7, #12 — chat rooms list)
- **Auth/pattern issues**: 2 (#16, #17)

**Recommendation**: Fix endpoint mismatches first (#8, #9, #10), then add missing backend routes (#1, #2, #15), then wire static shells in priority order.
