# Phase D — Teacher Web Wire Audit

**Branch**: `kilo/celestial-haven-jpr`  
**Date**: 2026-09-20  
**Status**: Backend services exist for most teacher flows; web pages are wired to wrong or missing endpoints

## Existing Teacher Web (Working)

| Page | Status | Details |
|------|--------|---------|
| Jobs list | ✅ Backend | `GET /jobs/open` exists with `@Roles("TEACHER")` |
| Apply to job | ✅ Backend | `POST /jobs/:jobId/apply` exists with connect deduction |
| Applications list | ✅ Backend | `GET /jobs/applications/mine` exists |
| Contracts list | ✅ Backend | `GET /contracts/mine/teacher` exists |
| Earnings | ✅ Backend | `GET /payments/earnings` + `POST /payments/payout` exist |
| Verification status | ✅ Backend | `GET /verification/status` exists |
| Progress submit | ✅ Backend | `POST /progress/:contractId` exists |
| Chat messages | ✅ Backend | `GET/POST /chat/:roomId/messages` exists |
| Profile | ⚠️ Partial | `GET /teachers/me/profile` + `PATCH /teachers/profile` exist, but web page uses `GET /users/me` |

## Gaps

### 1. Teacher jobs page calls parent-only endpoint (HIGH)
- **File**: `apps/web/app/teacher/jobs/page.tsx:35`
- **Issue**: Calls `paths.jobsMine` (`/jobs/mine`) which is `@Roles("PARENT")`. Teachers receive 403.
- **Fix**: Change to `"/jobs/open"`.

### 2. Teacher applications page calls non-existent endpoint (HIGH)
- **File**: `apps/web/app/teacher/applications/page.tsx:37`
- **Issue**: Calls `paths.applicationsMine` (`/applications/mine`). No `applications` controller exists. Backend route is `/jobs/applications/mine`.
- **Fix**: Change to `"/jobs/applications/mine"`.

### 3. Teacher apply page sends wrong body fields and uses broken fetch URL (HIGH)
- **File**: `apps/web/app/teacher/jobs/[id]/apply/page.tsx:27-35`
- **Issue**:
  1. Template string is malformed: `\( {base}/jobs/ \){id}/apply`
  2. Body sends `{ coverMessage, proposedRate }` but backend expects `{ coverNote }`
- **Fix**: Use `apiFetch(paths.job(id) + "/apply", { body: JSON.stringify({ coverNote }) })`.

### 4. Teacher chat inbox calls non-existent `/conversations` endpoint (HIGH)
- **File**: `apps/web/app/teacher/chat/page.tsx:31`
- **Issue**: Calls `apiFetch<Conversation[]>("/conversations")`. No conversations list endpoint exists.
- **Fix**: Add `GET /conversations` or reuse a chat rooms list endpoint.

### 5. Teacher availability page calls wrong endpoint path (HIGH)
- **File**: `apps/web/app/teacher/availability/page.tsx:63`
- **Issue**: Calls `paths.availability` (`/teacher/availability`). Backend routes are `/availability/mine`, `/availability/slots`, `/availability/packages`.
- **Fix**: Change to `"/availability/mine"` for GET and update save to `PATCH /availability/slots` + `POST /availability/packages`.

### 6. Teacher sessions page expects fields not returned by contracts API (HIGH)
- **File**: `apps/web/app/teacher/sessions/page.tsx:7-19`
- **Issue**: Expects `schedule`, `meetingMode`, `sessionCredits`, `maxCredits`, `parentName`, `studentName` from `GET /contracts/mine/teacher`. Backend `listForTeacher` only returns `parent` (select id, fullName) and `student` includes.
- **Fix**: Extend `listForTeacher` to include attendance/schedule fields, or create a dedicated sessions endpoint.

### 7. Teacher contracts page expects fields not returned by contracts API (HIGH)
- **File**: `apps/web/app/teacher/contracts/page.tsx:9-21`
- **Issue**: Expects `family`, `child`, `subject`, `rate`, `escrowHeld`, `sessionsDone`, `sessionsTotal`, `nextSession`, `milestoneIndex`. Backend only returns `parent` + `student` includes.
- **Fix**: Extend `listForTeacher` response shape or map backend fields to UI expectations.

### 8. Teacher settings sends nested `teacherProfile` to `PATCH /users/me` (HIGH)
- **File**: `apps/web/app/teacher/settings/page.tsx:119-127`
- **Issue**: Sends `{ teacherProfile: { language, notificationPrefs } }` to `PATCH /users/me`, but `UsersController.updateMe` only accepts `{ fullName?, email?, avatarUrl? }`.
- **Fix**: Extend `updateMe` DTO or create `PATCH /teachers/profile/settings`.

### 9. Teacher profile page expects fields not present in `GET /users/me` response (MEDIUM)
- **File**: `apps/web/app/teacher/profile/page.tsx:6-31`
- **Issue**: `TeacherMe` type expects `hourlyRateOnline`, `hourlyRateGroup`, `reviewCount`, `idVerified`, `degreeVerified`, `badgeLevel`, `subjects`, `gradeLevels`, `certificates`, `teachingStyles`, `bioEn`, `bioAm`, `tagline`, `introVideoUrl`. Backend `GET /users/me` returns a flat user with at most a nested `teacherProfile` containing a different shape.
- **Fix**: Use `GET /teachers/me/profile` for the profile page instead of `GET /users/me`.

### 10. Teacher analytics page calls non-existent endpoint (MEDIUM)
- **File**: `apps/web/app/teacher/analytics/page.tsx:25`
- **Issue**: Calls `paths.analyticsMine` (`/analytics/mine`). No analytics controller exists.
- **Fix**: Add `GET /analytics/mine` backend or remove the page.

### 11. Teacher onboarding page calls non-existent endpoint (MEDIUM)
- **File**: `apps/web/app/teacher/onboarding/page.tsx:85`
- **Issue**: Calls `paths.onboardingStatus` (`/onboarding/status`). No onboarding controller exists.
- **Fix**: Add `GET /onboarding/status` backend or remove the page.

### 12. Teacher risk flag page calls non-existent endpoint (MEDIUM)
- **File**: `apps/web/app/teacher/risk-flag/page.tsx:28`
- **Issue**: Calls `paths.riskFlags` (`/risk-flags`). No risk-flags controller exists.
- **Fix**: Add `GET /risk-flags/mine` backend or remove the page.

## Summary

- **7 HIGH**: Wrong endpoints (#1, #2, #3, #5), missing conversations (#4), sessions/contracts data-shape mismatches (#6, #7), settings PATCH shape (#8)
- **3 MEDIUM**: Profile uses wrong endpoint (#9), missing analytics/onboarding/risk-flag backends (#10, #11, #12)

Total: **12 gaps**
