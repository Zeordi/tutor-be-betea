# Phase H — Trust & Safety Gaps

Audited vault, verification, anti-poaching, geofence/attendance, risk flags, and safety pages on main branch.

## Backend Endpoint Audit

| Endpoint | Method | Roles | Status |
|----------|--------|-------|--------|
| `POST /vault/upload` | POST | TEACHER, SUPER_ADMIN | ✅ Exists |
| `GET /vault/pending` | GET | SUPER_ADMIN | ✅ Exists |
| `GET /vault/teacher/:teacherId` | GET | SUPER_ADMIN, TEACHER | ✅ Exists |
| `GET /vault/:id/decrypt` | GET | SUPER_ADMIN | ✅ Exists |
| `GET /verification/queue` | GET | SUPER_ADMIN, VERIFICATION_OFFICER | ✅ Exists |
| `GET /verification/status` | GET | TEACHER | ✅ Exists |
| `POST /verification/:id/approve` | POST | SUPER_ADMIN, VERIFICATION_OFFICER | ✅ Exists |
| `POST /verification/:id/reject` | POST | SUPER_ADMIN, VERIFICATION_OFFICER | ✅ Exists |
| `POST /verification/:id/request-more` | POST | SUPER_ADMIN, VERIFICATION_OFFICER | ✅ Exists |
| `POST /verification/:id/revoke` | POST | SUPER_ADMIN, VERIFICATION_OFFICER | ✅ Exists |
| `POST /attendance/check-in` | POST | TEACHER | ✅ Exists |
| `POST /attendance/check-out` | POST | TEACHER | ✅ Exists |
| `GET /attendance/contract/:contractId` | GET | JwtAuthGuard | ✅ Exists |
| `POST /attendance/:id/confirm` | POST | PARENT | ✅ Exists |
| `POST /support` | POST | PARENT, TEACHER | ✅ Exists |
| `GET /support/mine` | GET | JwtAuthGuard | ✅ Exists |
| `POST /admin/risk-flag/:userId` | POST | SUPER_ADMIN | ✅ Exists |
| `GET /admin/risk-flags` | GET | SUPER_ADMIN, SUPPORT_AGENT | ✅ Exists |
| `POST /admin/risk-flags/:id/clear` | POST | SUPER_ADMIN | ✅ Exists |

## Gaps

### 1. Anti-poaching sanitizes but never blocks messages (HIGH)
- **File**: `apps/api/src/modules/chat/chat.gateway.ts:57-68`, `apps/api/src/modules/chat/chat.service.ts:45-53`
- **Issue**: `AntiPoachingService.sanitize()` replaces restricted content with `[RESTRICTED CONTACT INFO]` and returns `blocked: true`, but neither the gateway nor the service checks `blocked` to reject or warn. The message is always saved and broadcast with sanitized text.
- **Impact**: Policy violation detection is silent — users learn after the fact that their message was altered, with no immediate feedback or escalation.

### 2. Chat Gateway WebSocket has no authentication (HIGH)
- **File**: `apps/api/src/modules/chat/chat.gateway.ts:27-30`
- **Issue**: `handleConnection` has no JWT or session validation. Comment says "Optional: auth checks can be added here later." Any client can open a WebSocket connection and join rooms.
- **Impact**: Unauthenticated users can listen to chat rooms or send messages if they guess room IDs.

### 3. Geofence check-in not enforced server-side (MEDIUM)
- **File**: `apps/api/src/modules/attendance/attendance.service.ts:39-48`
- **Issue**: `checkIn` calculates distance and sets `isVerifiedGeofence: false` when outside 150m radius, but does NOT block the check-in. The session is created with `requiresManualConfirm: true` but there's no logic to enforce manual review before proceeding.
- **Impact**: Teachers can fake attendance from anywhere; the flag is only informational.

### 4. Teacher risk flag page calls admin-only endpoint (MEDIUM)
- **File**: `apps/web/app/teacher/risk-flag/page.tsx:28`
- **Issue**: Calls `apiFetch(paths.riskFlags)` which maps to `/risk-flags` (admin endpoint requiring SUPER_ADMIN). Teachers receive 403 Forbidden. There is no `GET /risk-flags/mine` or similar teacher-facing endpoint.
- **Impact**: Teacher risk flag page is completely broken — cannot load their own flag data.

### 5. Parent safety page calls non-existent endpoint (MEDIUM)
- **File**: `apps/web/app/parent/safety/page.tsx:27`
- **Issue**: Calls `apiFetch("/disputes/mine")` which does not exist. The `SupportController` has `GET /support/mine` for user tickets, but no `/disputes/mine` endpoint.
- **Impact**: Parent Safety Center always shows error — cannot load disputes or safety cases.

### 6. Parent support create page is static — no API call (MEDIUM)
- **File**: `apps/web/app/parent/support/create/page.tsx`
- **Issue**: The 3-step form has no `apiFetch` or form submission. The backend `POST /support` accepts `reasonType`, `explanation`, `evidenceAttachmentUrls`, but the page never calls it. Step 3 just shows a static "Report Submitted" with fake case number `#TBB-28471`.
- **Impact**: Parents cannot actually submit support tickets from the web app.

### 7. Anti-poaching Telegram regex is overly broad (LOW)
- **File**: `packages/validators/src/index.ts:159`
- **Issue**: Pattern `/@\w{4,}/g` matches any `@username`-like string, not just Telegram handles. This will falsely flag legitimate text containing `@` followed by 4+ word characters.
- **Impact**: False positives in chat — legitimate messages get sanitized unnecessarily.

### 8. Attendance check-out risk flag has no threshold config (LOW)
- **File**: `apps/api/src/modules/attendance/attendance.service.ts:88-107`
- **Issue**: 4-hour max duration is hardcoded. Risk flag is created but there's no escalation to suspend teacher or notify parent automatically.
- **Impact**: Excessive sessions are logged but not acted upon.

## Summary

- **2 HIGH**: Anti-poaching never blocks messages; Chat Gateway has no WebSocket auth
- **3 MEDIUM**: Geofence not enforced server-side; teacher risk flag page broken (admin endpoint); parent safety page broken (missing endpoint); parent support create static
- **3 LOW**: Telegram regex false positives; attendance risk flag no escalation; vault decrypt SUPER_ADMIN only (teachers can't decrypt own docs)

Total: **8 gaps**
