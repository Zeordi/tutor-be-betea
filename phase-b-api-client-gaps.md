# Phase B — Shared API Client Audit

  
**Status**: Core client utilities exist; multiple pages bypass or misuse them

## Existing Client (Working)

| Area | Status | Details |
|------|--------|---------|
| Web `apiFetch` | ✅ | `apps/web/lib/api.ts` provides `apiFetch<T>` with Authorization header, JSON serialization, error throwing |
| Web `auth.ts` | ✅ | `getToken`, `setToken`, `clearToken`, `setSession`, `isAuthenticated` |
| Web canonical paths | ✅ | `paths` object covers contracts, jobs, payments, notifications, etc. |
| Mobile `apiRequest` | ✅ | `apps/mobile/lib/api.ts` uses `SecureStore`, `apiRequest<T>`, and `api.get/post/patch/delete` helpers |
| Mobile canonical paths | ✅ | `paths` object with same conventions as web |
| Layout auth guards | ✅ | Web parent/teacher layouts check `localStorage.getItem("token")` and redirect to `/login` |

## Gaps

### 1. Login page bypasses `apiFetch` and hardcodes API_URL (MEDIUM)
- **File**: `apps/web/app/(auth)/login/page.tsx:8-10, 39-43, 60-67, 95-101`
- **Issue**: Uses raw `fetch` with `process.env.NEXT_PUBLIC_API_URL` instead of `getApiUrl()` / `apiFetch`.
- **Fix**: Refactor login, OTP send, OTP verify, and password reset calls to use `apiFetch` and `getApiUrl()`.

### 2. Teacher apply page uses malformed template string for API URL (MEDIUM)
- **File**: `apps/web/app/teacher/jobs/[id]/apply/page.tsx:27`
- **Issue**: 
  ```ts
  const res = await fetch(`\( {base}/jobs/ \){id}/apply`, { ... })
  ```
  The template string is broken and will produce an invalid URL.
- **Fix**: Use `apiFetch(paths.jobApply(id), { ... })` or `fetch(\`\${base}/jobs/\${id}/apply\`)`.

### 3. No request timeout — fetch can hang indefinitely (MEDIUM)
- **File**: `apps/web/lib/api.ts:133-136`, `apps/mobile/lib/api.ts:126`
- **Issue**: `fetch` is called with no `AbortSignal.timeout` or manual timeout.
- **Impact**: Slow networks or hanging providers will freeze the UI.

### 4. No retry logic for transient failures (LOW)
- **File**: `apps/web/lib/api.ts:133-136`, `apps/mobile/lib/api.ts:126`
- **Issue**: A single failed request shows an error; there is no exponential backoff or retry for 502/503/network errors.
- **Fix**: Wrap `fetch` with a retry helper (max 2 retries, 1s delay).

### 5. No automatic 401 handling / token refresh (LOW)
- **File**: `apps/web/lib/api.ts:140-146`
- **Issue**: On 401, the error is thrown to the caller. No attempt is made to refresh the token or re-authenticate silently.
- **Fix**: Detect 401, attempt refresh via a `/auth/refresh` endpoint (when added), then retry the original request.

### 6. Mobile `paths` contains non-existent or wrong routes (MEDIUM)
- **File**: `apps/mobile/lib/api.ts:29, 49-52`
- **Issue**:
  - `jobsMine: "/jobs/mine"` — this route is `@Roles("PARENT")`; teachers calling it get 403
  - `applicationsMine: "/applications/mine"` — no such controller exists
  - `applicationsAction` / `applicationsCreate` — no such controllers exist
- **Fix**: Remove or correct these paths to match backend (`/jobs/open`, `/jobs/applications/mine`, `/jobs/:jobId/apply`).

### 7. Web `paths` used incorrectly by teacher pages (MEDIUM)
- **File**: `apps/web/app/teacher/jobs/page.tsx:35`
- **Issue**: Teacher jobs page calls `paths.jobsMine` (`/jobs/mine`) which is `@Roles("PARENT")`.
- **Fix**: Change to `"/jobs/open"` or add a `jobsOpen` path constant.

### 8. Web `paths` references endpoints that don't exist on backend (LOW)
- **File**: `apps/web/lib/api.ts:31, 97, 100, 109-110`
- **Issue**:
  - `progressMine: "/progress/mine"` — backend has no `GET /progress/mine`
  - `analyticsMine: "/analytics/mine"` — no analytics controller
  - `onboardingStatus: "/onboarding/status"` — no onboarding controller
  - `riskFlags: "/risk-flags"` — no risk-flags controller
  - `applicationsMine` / `applicationsAction` — no applications controller
- **Fix**: Add missing backend controllers or remove unused path constants.

### 9. Teacher settings/profile send nested `teacherProfile` updates via `PATCH /users/me` (MEDIUM)
- **File**: `apps/web/app/teacher/settings/page.tsx:119-127`, `apps/web/app/teacher/profile/page.tsx:120-123`
- **Issue**: Both pages send `{ teacherProfile: { ... } }` to `PATCH /users/me`, but `UsersController.updateMe` only accepts `{ fullName?, email?, avatarUrl? }`.
- **Fix**: Either extend `updateMe` DTO to accept nested teacher profile fields, or create a dedicated `PATCH /teachers/profile` endpoint.

## Summary

- **2 MEDIUM**: Login page bypasses client; teacher apply URL is malformed
- **2 MEDIUM**: Mobile/web paths point to wrong or missing routes
- **2 LOW**: No retry/timeout/refresh logic
- **1 LOW**: Path constants reference non-existent endpoints

Total: **8 gaps**
