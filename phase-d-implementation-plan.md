# Phase D — Teacher Web Wire Implementation Plan

**Branch**: `kilo/celestial-haven-jpr`  
**Date**: 2026-09-20  
**Scope**: Fix teacher web pages to use live backend data  
**Gaps**: 12 total (7 HIGH, 3 MEDIUM, 2 LOW)

---

## Priority 1 — Quick Wins (Path/Body Fixes)

These fixes require only frontend edits; no backend changes.

### 1. Fix teacher jobs page endpoint
- **File**: `apps/web/app/teacher/jobs/page.tsx:35`
- **Change**: Replace `paths.jobsMine` with `"/jobs/open"`
- **Why**: `/jobs/mine` is `@Roles("PARENT")`; teachers get 403. `/jobs/open` is the correct teacher-facing route.

### 2. Fix teacher applications page endpoint
- **File**: `apps/web/app/teacher/applications/page.tsx:37`
- **Change**: Replace `paths.applicationsMine` with `"/jobs/applications/mine"`
- **Why**: No `/applications/mine` controller exists. Backend route is `/jobs/applications/mine`.

### 3. Fix teacher apply page URL and request body
- **File**: `apps/web/app/teacher/jobs/[id]/apply/page.tsx:27-35`
- **Changes**:
  1. Fix malformed template string to `fetch(\`${base}/jobs/${id}/apply\`, ...)`
  2. Replace body `{ coverMessage, proposedRate }` with `{ coverNote: coverMessage }`
- **Why**: Backend expects `coverNote`; `proposedRate` is ignored. The broken template string produces an invalid URL.

### 4. Fix teacher availability page endpoint
- **File**: `apps/web/app/teacher/availability/page.tsx:63`
- **Change**: Replace `paths.availability` (`/teacher/availability`) with `"/availability/mine"`
- **Also update save logic**: Split the single save call into:
  - `PATCH /availability/slots` with `{ slots }`
  - `POST /availability/packages` for each package change
- **Why**: Backend routes are `/availability/mine`, `/availability/slots`, `/availability/packages`. The current path does not exist.

---

## Priority 2 — Data Shape Fixes (Backend + Frontend)

These require extending backend responses so the UI can render correctly.

### 5. Extend teacher contract list response
- **File**: `apps/api/src/modules/contracts/contracts.service.ts:107-116`
- **Change**: In `listForTeacher`, add includes for:
  - `attendance` (ordered by `checkInTime desc`, limited to recent 10)
  - `progress` (ordered by `weekNumber desc`, limited to recent 5)
- **Also update** `listForParent` (`contracts.service.ts:96-105`) with the same includes for parent-facing sessions/calendar pages.
- **Why**: Teacher sessions page (`apps/web/app/teacher/sessions/page.tsx`) expects `schedule`, `meetingMode`, `sessionCredits`, `maxCredits`. Teacher contracts page (`apps/web/app/teacher/contracts/page.tsx`) expects `escrowHeld`, `sessionsDone`, `sessionsTotal`, `nextSession`, `milestoneIndex`. Parent calendar (`apps/web/app/parent/calendar/page.tsx`) and parent sessions page have the same mismatch.
- **Frontend mapping**: Map backend fields to UI-expected names in the page components (e.g., `contract.attendance[0]?.checkInTime` → `schedule`, `contract.status` → milestone index).

### 6. Extend `PATCH /users/me` to accept teacher settings
- **File**: `apps/api/src/modules/users/users.controller.ts:32-38`
- **Change**: Update the `updateMe` DTO to accept:
  - `notificationPrefs?: any`
  - `language?: string`
  - `payoutMethod?: string`
  - `payoutAccount?: string`
- **Also update** `apps/api/src/modules/users/users.service.ts:87-125` to pass these fields through to `prisma.user.update`.
- **Why**: Teacher settings page (`apps/web/app/teacher/settings/page.tsx`) sends `{ teacherProfile: { language, notificationPrefs } }` but the endpoint only accepts flat user fields. The `UsersService.updateProfile` already accepts `notificationPrefs` but the controller DTO does not expose it.

---

## Priority 3 — Endpoint Migration (Frontend)

### 7. Fix teacher profile page to use correct endpoint
- **File**: `apps/web/app/teacher/profile/page.tsx:80`
- **Change**: Replace `apiFetch<TeacherMe>(paths.usersMe)` with `apiFetch<TeacherMe>(`/teachers/me/profile`)`
- **Why**: `GET /users/me` returns a flat user shape. `GET /teachers/me/profile` returns the full teacher profile with `hourlyRate`, `subjects`, `teachingStyles`, etc.

---

## Priority 4 — New Backend Endpoints Required

These require adding new controllers/services to support teacher web pages.

### 8. Add conversations list endpoint
- **Files to create**:
  - `apps/api/src/modules/conversations/conversations.controller.ts`
  - `apps/api/src/modules/conversations/conversations.service.ts`
  - `apps/api/src/modules/conversations/conversations.module.ts`
- **Endpoint**: `GET /conversations`
- **Response shape**:
  ```ts
  {
    id: string;
    otherUser: { id: string; fullName: string; avatarUrl: string | null };
    lastMessage: { body: string; createdAt: string } | null;
    unreadCount: number;
  }
  ```
- **Implementation notes**:
  - Query `chatMessage` grouped by `roomId`
  - Join with `User` to get `otherUser` details
  - Count unread messages where `senderId !== currentUserId` and `readAt === null`
  - Guard with `JwtAuthGuard`
- **Why**: Both parent (`apps/web/app/parent/chat/page.tsx`) and teacher (`apps/web/app/teacher/chat/page.tsx`) chat inboxes call `/conversations`. No such endpoint exists.

### 9. Add analytics endpoint
- **File to create**: `apps/api/src/modules/analytics/analytics.controller.ts` + service + module
- **Endpoint**: `GET /analytics/mine`
- **Guard**: `JwtAuthGuard` + `RolesGuard` + `@Roles("TEACHER")`
- **Response shape**:
  ```ts
  {
    profileViews: number;
    jobMatches: number;
    applyRate: number;
    rehireRate: number;
    subjectDemand: { name: string; pct: number }[];
    earningsForecast: { label: string; amount: string }[];
  }
  ```
- **Implementation notes**:
  - `profileViews`: count distinct `teacherId` from `teacherProfile.views` or similar log table (if no view log exists, return 0 or stub)
  - `jobMatches`: count of `parentJob` where `status = "OPEN"` and subjects overlap with teacher subjects
  - `applyRate`: `COUNT(jobApplication WHERE teacherId = me) / COUNT(parentJob WHERE status = "OPEN")`
  - `rehireRate`: count of repeat contracts / total contracts
  - `subjectDemand`: aggregate open jobs by subject
  - `earningsForecast`: sum of `agreedAmount` from active contracts projected by month
- **Why**: Teacher analytics page (`apps/web/app/teacher/analytics/page.tsx`) calls this endpoint and is currently a static shell.

### 10. Add onboarding status endpoint
- **File to create**: `apps/api/src/modules/onboarding/onboarding.controller.ts` + service + module
- **Endpoint**: `GET /onboarding/status`
- **Guard**: `JwtAuthGuard` + `RolesGuard` + `@Roles("TEACHER")`
- **Response shape**:
  ```ts
  {
    id: number;
    icon: string;
    label: string;
    desc: string;
    status: "done" | "issue" | "pending" | "locked";
    time: string;
    href?: string;
  }[]
  ```
- **Implementation notes**:
  - Derive status from `teacherProfile.onboardingStep`, `isIdVerified`, `isEduVerified`, `payoutMethod`
  - Step 1 (bio): done if `bio` is non-empty
  - Step 2 (documents): issue if any `vaultDocument` has status `REJECTED` or `NEEDS_MORE_INFO`; pending if no docs submitted; done if approved
  - Step 3 (availability): done if `teacherAvailability` records exist
  - Step 4 (payout): done if `payoutMethod` is set
  - Step 5 (intro call): always pending (manual process)
  - Step 6 (go live): locked until steps 1-5 are done
- **Why**: Teacher onboarding page (`apps/web/app/teacher/onboarding/page.tsx`) currently uses hardcoded step data.

### 11. Add risk flags endpoint
- **File to create**: `apps/api/src/modules/risk-flags/risk-flags.controller.ts` + service + module
- **Endpoint**: `GET /risk-flags/mine`
- **Guard**: `JwtAuthGuard` + `RolesGuard` + `@Roles("TEACHER")`
- **Response shape**:
  ```ts
  {
    id: string;
    status: "ACTIVE" | "RESOLVED";
    reason: string;
    reportedAt: string;
    restrictions: string[];
    timeline: { date: string; event: string; done: boolean; current: boolean }[];
  }
  ```
- **Implementation notes**:
  - If no `RiskFlag` table exists, create a Prisma model or return `null` with a note to add the table
  - If the table exists, query by `teacherId`
  - Timeline can be derived from audit logs or a dedicated `riskFlagTimeline` table
- **Why**: Teacher risk flag page (`apps/web/app/teacher/risk-flag/page.tsx`) is currently a static shell.

---

## Summary

| Priority | Fixes | Backend changes | Frontend changes |
|----------|-------|-----------------|------------------|
| 1 | #1, #2, #3, #5 (path/body) | 0 | 4 files |
| 2 | #6, #8 (DTO + includes) | 2 files | 2 files |
| 3 | #9 (profile endpoint) | 0 | 1 file |
| 4 | #4, #10, #11, #12 (new endpoints) | 4 new modules | 4 files |

**Estimated scope**:
- 4 quick frontend-only fixes (1-2 hours)
- 2 backend response-shape extensions (2-3 hours)
- 1 frontend endpoint swap (15 mins)
- 4 new backend endpoints (4-6 hours)

**Total estimated effort**: 8-12 hours
