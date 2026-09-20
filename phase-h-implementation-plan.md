# Phase H — Trust & Safety Implementation Plan

**Branch**: `kilo/celestial-haven-jpr`  
**Date**: 2026-09-20  
**Scope**: Fix vault, verification, anti-poaching, geofence, risk flags, and safety flows  
**Gaps**: 8 total (2 HIGH, 3 MEDIUM, 3 LOW)

---

## Priority 1 — Anti-Poaching and Chat Security (Backend)

### 1. Block messages when anti-poaching detects restricted content
- **File**: `apps/api/src/modules/chat/chat.service.ts:45-53`
- **Change**: Update `sanitizeMessage` (or equivalent) to return a result object. In `chat.service.ts` and `chat.gateway.ts`, check `blocked`:
  ```ts
  const { sanitized, blocked } = antiPoachingService.sanitize(messageBody);
  if (blocked) {
    // Save to DB with sanitized text but DO NOT broadcast
    // Return error to sender: "Message contains restricted content"
    throw new BadRequestException("Message contains restricted contact information");
  }
  ```
- **Why**: Policy violations are silent; users learn after the fact that their message was altered.

### 2. Add JWT authentication to Chat Gateway WebSocket
- **File**: `apps/api/src/modules/chat/chat.gateway.ts:27-30`
- **Change**: In `handleConnection`, validate JWT from query param or auth header:
  ```ts
  @SubscribeMessage('auth')
  async handleAuth(client: Socket, payload: { token: string }) {
    const user = await this.jwtService.verifyAsync(payload.token);
    client.data.user = user;
    client.join(`user:${user.id}`);
  }
  ```
  Reject unauthenticated connections with `client.disconnect()`.
- **Also update** frontend chat screens to send auth token on connection.
- **Why**: Any client can open a WebSocket and join rooms.

---

## Priority 2 — Fix Broken Trust & Safety Pages (Frontend + Backend)

### 3. Enforce geofence server-side
- **File**: `apps/api/src/modules/attendance/attendance.service.ts:39-48`
- **Change**: In `checkIn`, after calculating distance:
  ```ts
  if (distance > 150) {
    // Block check-in entirely; require manual review
    const attendance = await this.createAttendance({
      ...data,
      isVerifiedGeofence: false,
      requiresManualConfirm: true,
      status: "PENDING_REVIEW",
    });
    // Notify parent for manual confirmation
    await this.notificationService.send(parentId, {
      type: "GEOFENCE_REVIEW",
      attendanceId: attendance.id,
    });
    return attendance;
  }
  ```
- **Why**: Teachers can fake attendance from anywhere; the flag is only informational.

### 4. Add teacher-facing risk flags endpoint
- **File to create**: `apps/api/src/modules/risk-flags/risk-flags.controller.ts` (add new handler)
- **Endpoint**: `GET /risk-flags/mine`
- **Guard**: `JwtAuthGuard` + `@Roles("TEACHER")`
- **Response**: Same shape as `GET /admin/risk-flags` but filtered by `teacherId = currentUser.id`
- **Why**: Teacher risk flag page calls admin-only `/risk-flags` and gets 403.

### 5. Fix parent safety page endpoint
- **File**: `apps/web/app/parent/safety/page.tsx:27`
- **Change**: Replace `apiFetch("/disputes/mine")` with `apiFetch("/support/mine?type=DISPUTE")` (or whichever endpoint returns dispute data)
- **Backend needed**: If `/support/mine` does not filter by type, add query param support.
- **Why**: `/disputes/mine` does not exist.

### 6. Wire parent support create page
- **File**: `apps/web/app/parent/support/create/page.tsx`
- **Change**: On form submit, call `POST /support` with:
  ```ts
  {
    reasonType: formData.reasonType,
    explanation: formData.explanation,
    evidenceAttachmentUrls: formData.attachments,
  }
  ```
  On success, navigate to `/parent/support` with the returned case ID.
- **Why**: The form never submits; it shows a fake case number.

---

## Priority 3 — Low-Priority Fixes (Backend + Frontend)

### 7. Fix Telegram regex false positives
- **File**: `packages/validators/src/index.ts:159`
- **Change**: Narrow pattern from `/\@\w{4,}/g` to match only Telegram handles:
  ```ts
  /\B@([a-zA-Z0-9_]{4,32})\b/g
  ```
- **Why**: Pattern matches any `@username`-like string, not just Telegram.

### 8. Add attendance risk flag escalation and teacher vault decrypt
- **File**: `apps/api/src/modules/attendance/attendance.service.ts:88-107`
- **Change**: In the 4-hour max duration check, after creating the risk flag:
  ```ts
  if (durationHours > 4) {
    await this.riskFlagService.create({
      userId: attendance.teacherId,
      reason: `Session exceeded 4-hour limit (${durationHours}h)`,
      severity: "HIGH",
    });
    // Optionally suspend teacher pending review
    await this.usersService.update(attendance.teacherId, { isSuspended: true });
  }
  ```
- **Also update** `vault/:id/decrypt` to allow `TEACHER` role when `document.teacherId === currentUser.id`.
- **Why**: Excessive sessions are logged but not acted upon; teachers cannot decrypt their own documents.

---

## Summary

| Priority | Fixes | Backend changes | Frontend changes |
|----------|-------|-----------------|------------------|
| 1 | #1-#2 (anti-poaching + chat auth) | 2 files | 1-2 chat screens |
| 2 | #3-#6 (geofence, risk flags, safety, support) | 2-3 files | 3 pages |
| 3 | #7-#8 (regex, escalation, vault decrypt) | 2 files | 0 |

**Estimated scope**:
- Priority 1 (anti-poaching + chat auth): 3-4 hours
- Priority 2 (page fixes): 3-4 hours
- Priority 3 (low-priority): 1-2 hours

**Total estimated effort**: 7-10 hours
