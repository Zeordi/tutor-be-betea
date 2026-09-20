# Phase E — Mobile Wire Implementation Plan

**Branch**: `kilo/celestial-haven-jpr`  
**Date**: 2026-09-20  
**Scope**: Fix mobile screens to use live backend data  
**Gaps**: 18 total (7 HIGH, 7 static shells, 2 shared, 2 auth/pattern)

---

## Priority 1 — Endpoint Fixes (Frontend Only)

These are pure path/body corrections; no backend changes required.

### 1. Fix teacher jobs tab endpoint
- **File**: `apps/mobile/app/(teacher)/(tabs)/jobs.tsx:45`
- **Change**: Replace `paths.jobsMine` (`/jobs/mine`) with `"/jobs/open"`
- **Why**: `/jobs/mine` is `@Roles("PARENT")`; teachers get 403. `/jobs/open` is the correct teacher-facing route.

### 2. Fix teacher applications endpoint
- **File**: `apps/mobile/app/(teacher)/applications.tsx:43`
- **Change**: Replace `paths.applicationsMine` (`/applications/mine`) with `"/jobs/applications/mine"`
- **Why**: No `/applications/mine` controller exists. Backend route is `/jobs/applications/mine`.

### 3. Fix teacher apply screens — endpoint + body
- **Files**:
  - `apps/mobile/app/(teacher)/apply/[jobId].tsx:57`
  - `apps/mobile/app/(teacher)/job/[id].tsx:75`
- **Changes**:
  1. Replace `paths.applicationsCreate` (`/applications`) with `paths.job(id) + "/apply"` or template `/jobs/${id}/apply`
  2. Replace body `{ jobId }` with `{ coverNote: cover }`
- **Why**: Backend expects `POST /jobs/:jobId/apply` with `{ coverNote }`. The current path and body are both wrong.

### 4. Fix parent job detail applicants endpoint
- **File**: `apps/mobile/app/(parent)/job/[id].tsx:47`
- **Change**: Replace inline `/jobs/${id}/applications` with `paths.job(id) + "/applications"` only if backend adds the route. Otherwise, remove the applicants tab.
- **Interim fix**: Wrap the applicants fetch in a try/catch and show "Applicants data unavailable" instead of a full-page error.

### 5. Fix mobile `paths` constants
- **File**: `apps/mobile/lib/api.ts:29, 49-52`
- **Changes**:
  - Remove `jobsMine: "/jobs/mine"` or mark it as parent-only
  - Remove `applicationsMine`, `applicationsAction`, `applicationsCreate` (nonexistent)
  - Add `jobsOpen: "/jobs/open"`
  - Add `jobApply: (id: string) => `/jobs/${id}/apply``
- **Why**: Wrong paths in the canonical client cause 403/404 across multiple screens.

---

## Priority 2 — Auth Guard Fixes (Frontend Only)

### 6. Add auth redirect to mobile tab layouts
- **Files**:
  - `apps/mobile/app/(parent)/(tabs)/_layout.tsx`
  - `apps/mobile/app/(teacher)/(tabs)/_layout.tsx`
- **Change**: In each layout, add a `useEffect` that:
  1. Calls `getToken()` from `lib/api.ts`
  2. If null, redirects to `/login` using `router.replace("/login")`
- **Why**: Unauthenticated users can currently access tab screens without login.

---

## Priority 3 — Inline Fetch Refactor (Frontend Only)

### 7. Refactor raw fetch calls to use `apiRequest`
- **Files**:
  - `apps/mobile/app/(parent)/children/add.tsx:26`
  - `apps/mobile/app/(teacher)/location.tsx:47`
  - `apps/mobile/hooks/usePushNotifications.ts:67`
  - `apps/mobile/app/(shared)/notifications.tsx:24`
  - `apps/mobile/lib/video/index.ts:19`
- **Change**: Replace raw `fetch(`${process.env.EXPO_PUBLIC_API_URL}/...`)` with `apiRequest("/...")` from `lib/api.ts`
- **Why**: Inline fetch bypasses the canonical client, hardcodes the API URL, and misses auth header injection.

---

## Priority 4 — Static Shells → Live Data (Frontend + Backend)

### 8. Wire parent booking screen
- **File**: `apps/mobile/app/(parent)/booking.tsx`
- **Backend needed**: None — reuse existing endpoints
- **Changes**:
  1. Remove hardcoded tutor name, package, prices
  2. Fetch teacher availability via `GET /availability/mine` (or a new parent-facing availability endpoint)
  3. On confirm, call `POST /contracts` then `POST /escrow/:id/hold` then `POST /payments/initiate`
  4. Navigate to payment provider or show success
- **Why**: Currently a static shell with no API calls.

### 9. Wire parent calendar screen
- **File**: `apps/mobile/app/(parent)/calendar.tsx`
- **Backend needed**: None — reuse existing endpoints
- **Changes**:
  1. Remove hardcoded `DAYS` and `SLOTS`
  2. Fetch contracts via `GET /contracts/mine/parent`
  3. Map contract `startDate`/`endDate` to calendar days
  4. Show session slots derived from contract data
- **Why**: Currently shows static demo data; no fetch to backend.

### 10. Wire parent notification settings
- **File**: `apps/mobile/app/(parent)/notification-settings.tsx`
- **Backend needed**: None — reuse `PATCH /users/me`
- **Changes**:
  1. On toggle, persist via `PATCH /users/me` with `{ notificationPrefs: { ... } }`
  2. Load initial state from `GET /users/me` → `notificationPrefs`
- **Why**: Currently local state only; no API persistence.

### 11. Wire parent replacement screen
- **File**: `apps/mobile/app/(parent)/replacement.tsx`
- **Backend needed**: Verify `POST /replacements` exists
- **Changes**:
  1. On submit, call `POST /replacements` with `{ contractId, reason, details }`
  2. Show success/error from API response instead of hardcoded `Alert.alert`
- **Why**: Currently shows a static success alert; no API call.

### 12. Wire parent messages inbox
- **File**: `apps/mobile/app/(parent)/(tabs)/messages.tsx`
- **Backend needed**: Same as teacher — `GET /conversations` (see #16 below)
- **Changes**:
  1. Fetch `GET /conversations` on mount
  2. Render `FlatList` of conversation items
  3. Navigate to `/(shared)/chat/[id]` on tap
- **Why**: Currently shows "No chat rooms endpoint wired yet".

### 13. Wire teacher messages inbox
- **File**: `apps/mobile/app/(teacher)/(tabs)/messages.tsx`
- **Backend needed**: Same `GET /conversations` endpoint
- **Changes**: Same as #12 — fetch conversations, render list, navigate to chat thread

---

## Priority 5 — New Backend Endpoints Required

### 14. Add `GET /conversations` endpoint
- **Files to create**:
  - `apps/api/src/modules/conversations/conversations.controller.ts`
  - `apps/api/src/modules/conversations/conversations.service.ts`
  - `apps/api/src/modules/conversations/conversations.module.ts`
- **Guard**: `JwtAuthGuard`
- **Response shape**:
  ```ts
  {
    id: string;              // roomId
    otherUser: { id: string; fullName: string; avatarUrl: string | null };
    lastMessage: { body: string; createdAt: string } | null;
    unreadCount: number;
  }[]
  ```
- **Implementation notes**:
  - Group `chatMessage` by `roomId`
  - For each room, find the other participant by querying `chatMessage` senders
  - Count unread messages where `senderId !== currentUserId`
  - Return rooms sorted by `lastMessage.createdAt` desc
- **Why**: Both parent and teacher mobile messages tabs, plus web chat inboxes, depend on this endpoint.

### 15. Add `GET /subscriptions/plans` endpoint (optional)
- **File to modify**: `apps/api/src/modules/subscriptions/subscriptions.controller.ts`
- **Change**: Add `@Get("plans")` handler that returns available subscription plans
- **Why**: Mobile parent subscription screen (`apps/mobile/app/(parent)/subscription.tsx:42`) calls this endpoint. Web parent subscription page may also use it.
- **Alternative**: If plans are static, hardcode them in the mobile screen and remove the API call.

### 16. Add `POST /escrow/:id/hold` endpoint (if missing)
- **File to check**: `apps/api/src/modules/escrow/escrow.controller.ts`
- **Issue**: Mobile parent contract create (`apps/mobile/app/(parent)/contract/create.tsx:35-38`) calls `POST /escrow/:id/hold` after contract creation.
- **Fix**: If the endpoint does not exist, either:
  - Add it to `EscrowController`, or
  - Move escrow hold logic inside `POST /contracts` so the mobile screen only needs one call

---

## Priority 6 — Static Shells → Live Data (Backend + Frontend)

### 17. Wire teacher analytics screen
- **File**: `apps/mobile/app/(teacher)/analytics.tsx`
- **Backend needed**: `GET /analytics/mine` (same endpoint as web — see Phase D Priority 4 #9)
- **Changes**:
  1. Fetch `GET /analytics/mine` on mount
  2. Map response to UI cards: profileViews, jobMatches, applyRate, rehireRate, subjectDemand, earningsForecast
  3. Replace hardcoded metrics with live data
- **Why**: Currently a static shell with hardcoded numbers.

### 18. Wire teacher onboarding screen
- **File**: `apps/mobile/app/(teacher)/onboarding.tsx`
- **Backend needed**: `GET /onboarding/status` (same endpoint as web — see Phase D Priority 4 #10)
- **Changes**:
  1. Fetch `GET /onboarding/status` on mount
  2. Map response steps to UI, preserving the existing step icons and layout
  3. Keep hardcoded fallback if API fails
- **Why**: Currently uses hardcoded `STEPS` array.

### 19. Wire teacher risk flag screen
- **File**: `apps/mobile/app/(teacher)/risk-flag.tsx`
- **Backend needed**: `GET /risk-flags/mine` (same endpoint as web — see Phase D Priority 4 #11)
- **Changes**:
  1. Fetch `GET /risk-flags/mine` on mount
  2. If null, show "No active risk flags" green state
  3. If data exists, render the existing red flag UI with live data
  4. Wire appeal submit to `POST /support` with `category: "SAFETY"`
- **Why**: Currently a static shell with hardcoded flag data and timeline.

---

## Shared Backend Dependencies (Phase D + E)

These endpoints are needed by both web and mobile. Build them once in Phase D Priority 4, then wire both platforms.

| Endpoint | Web files | Mobile files |
|----------|-----------|--------------|
| `GET /conversations` | `apps/web/app/parent/chat/page.tsx`, `apps/web/app/teacher/chat/page.tsx` | `apps/mobile/app/(parent)/(tabs)/messages.tsx`, `apps/mobile/app/(teacher)/(tabs)/messages.tsx` |
| `GET /analytics/mine` | `apps/web/app/teacher/analytics/page.tsx` | `apps/mobile/app/(teacher)/analytics.tsx` |
| `GET /onboarding/status` | `apps/web/app/teacher/onboarding/page.tsx` | `apps/mobile/app/(teacher)/onboarding.tsx` |
| `GET /risk-flags/mine` | `apps/web/app/teacher/risk-flag/page.tsx` | `apps/mobile/app/(teacher)/risk-flag.tsx` |

---

## Summary

| Priority | Fixes | Backend changes | Frontend changes |
|----------|-------|-----------------|------------------|
| 1 | #1, #2, #3, #4, #5 (endpoint/body/paths) | 0 | 7 files |
| 2 | #6 (auth redirect) | 0 | 2 files |
| 3 | #7 (inline fetch refactor) | 0 | 5 files |
| 4 | #8, #9, #10, #11, #12, #13 (static shells) | 0-1 | 6 files |
| 5 | #14, #15, #16 (new endpoints) | 2-3 new modules | 0 |
| 6 | #17, #18, #19 (static shells → live) | Reuse Phase D endpoints | 3 files |

**Estimated scope**:
- Priority 1-3 (frontend fixes): 3-4 hours
- Priority 4 (wire shells to existing APIs): 3-4 hours
- Priority 5 (new backends): 3-4 hours
- Priority 6 (wire analytics/onboarding/risk-flag): 2-3 hours

**Total estimated effort**: 11-15 hours

**Note**: Priority 5 and 6 depend on Phase D Priority 4 backend work. If Phase D backends are built first, Phase E frontend wiring is straightforward mapping of the same response shapes.
