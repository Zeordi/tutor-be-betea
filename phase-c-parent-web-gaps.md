# Phase C — Parent Web Wire Audit

**Branch**: `kilo/celestial-haven-jpr`  
**Date**: 2026-09-20  
**Status**: Core parent flows are live; chat, calendar, and sessions have data-shape gaps

## Existing Parent Web (Working)

| Page | Status | Details |
|------|--------|---------|
| Jobs list | ✅ | `GET /jobs/mine` wired with live data, applications tab |
| Job create | ✅ | `POST /jobs` wired; fetches children, posts job |
| Contracts list | ✅ | `GET /contracts/mine/parent` wired; escrow release wired |
| Wallet | ✅ | `GET /payments/wallet` wired with transactions + escrow |
| Notifications | ✅ | `GET /notifications` wired; mark read / mark all wired |
| Settings | ✅ | `GET /users/me` + `PATCH /users/me` wired for flat profile fields |
| Children add | ✅ | `POST /parents/children` wired |
| Checkout | ✅ | Payment initiation wired; provider status check wired; polling wired |
| Chat thread | ✅ | `POST /chat/:roomId/messages` wired with anti-poaching |

## Gaps

### 1. Parent chat inbox calls non-existent `/conversations` endpoint (HIGH)
- **File**: `apps/web/app/parent/chat/page.tsx:31`
- **Issue**: Calls `apiFetch<Conversation[]>("/conversations")` but no `conversations` controller exists in the API.
- **Impact**: Chat inbox is completely broken — 404 on load.
- **Fix**: Add a `GET /conversations` endpoint that returns room list with `otherUser`, `lastMessage`, and `unreadCount`, or reuse an existing chat rooms endpoint.

### 2. Parent sessions page expects fields not returned by `GET /contracts/mine/parent` (HIGH)
- **File**: `apps/web/app/parent/sessions/page.tsx:7-14`
- **Issue**: Expects `schedule`, `startDate`, `endDate`, `teacher.fullName`, `student.studentName` from contracts. Backend `listForParent` only returns `parent` (select id, fullName) and `student` includes. Missing: schedule, startDate, endDate, meetingMode, sessionCredits, maxCredits.
- **Impact**: Sessions list renders empty or with missing fields.
- **Fix**: Extend `contracts.service.ts:96-105` to include `attendance`, `progress`, `schedule`, `startDate`, `endDate`, `sessionCredits`, `maxCredits`, or create a dedicated sessions query.

### 3. Parent calendar expects fields not returned by contracts API (HIGH)
- **File**: `apps/web/app/parent/calendar/page.tsx:7-23`
- **Issue**: Expects `schedule`, `sessionCredits`, `maxCredits`, `tutor.fullName`, `tutor.teacherProfile` from `GET /contracts/mine/parent`. Backend does not return these fields.
- **Impact**: Calendar shows no sessions or incomplete session cards.
- **Fix**: Same as #2 — extend parent contract list response or add a sessions endpoint.

### 4. Parent checkout step 1 uses hardcoded slots — not fetched from availability API (LOW)
- **File**: `apps/web/app/parent/checkout/page.tsx:196-204`
- **Issue**: Hardcodes `["Mon 10:00", "Wed 14:00", "Fri 09:00"]` instead of fetching teacher availability.
- **Fix**: Wire to `GET /availability/mine` (teacher) or a new parent-facing teacher availability endpoint.

### 5. Parent settings `PATCH /users/me` does not support `notificationPrefs` (LOW)
- **File**: `apps/web/app/parent/settings/page.tsx:80-84`
- **Issue**: Sends `{ fullName, email, emergencyContact, addressLine, subCity }`. The `notificationPrefs` field is loaded in the type but not sent in the PATCH body.
- **Fix**: Add `notificationPrefs` to the `updateProfile` DTO or create a dedicated preferences endpoint.

## Summary

- **3 HIGH**: Chat inbox 404; sessions page data shape mismatch; calendar data shape mismatch
- **1 LOW**: Checkout hardcodes availability slots
- **1 LOW**: Settings PATCH missing notificationPrefs

Total: **5 gaps**
