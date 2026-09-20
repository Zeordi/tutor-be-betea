# Phase A — Auth Audit

**Branch**: `kilo/celestial-haven-jpr`  
**Date**: 2026-09-20  
**Status**: Core auth is live; hardening gaps remain

## Existing Auth (Working)

| Area | Status | Details |
|------|--------|---------|
| JWT strategy | ✅ | `JwtStrategy` uses `ExtractJwt.fromAuthHeaderAsBearerToken()`, `ignoreExpiration: false`, secret from `JWT_SECRET` |
| Token lifetimes | ✅ | Access token 15m, refresh token 7d |
| Role guards | ✅ | `JwtAuthGuard` + `RolesGuard` + `@Roles()` decorator enforce TEACHER/PARENT/ADMIN |
| Banned-user blocking | ✅ | `JwtStrategy.validate()` rejects `BANNED` and `SUSPENDED` statuses |
| OTP flow | ✅ | `POST /auth/otp/send` + `POST /auth/otp/verify` with Redis primary + in-memory fallback |
| Password hashing | ✅ | bcrypt with 10 rounds |
| Login methods | ✅ | Email+password, phone+password+verificationToken, Google placeholder |
| Registration | ✅ | Consumes OTP verification token, creates user with `PENDING_VERIFICATION` status |
| Password reset | ✅ | `POST /auth/password/forgot` → OTP → `POST /auth/password/reset` |
| Client-side session | ✅ | `lib/auth.ts` stores token + role in localStorage; layouts redirect unauthenticated users |

## Gaps

### 1. No refresh token endpoint — users must re-login after 15 minutes (HIGH)
- **File**: `apps/api/src/modules/auth/auth.service.ts:396-403`
- **Issue**: Access tokens expire in 15m, but there is no `POST /auth/refresh` endpoint. The `refreshToken` is generated but never used.
- **Impact**: Active users are logged out every 15 minutes.

### 2. No token revocation / blacklist — logout is client-side only (HIGH)
- **File**: `apps/web/app/parent/layout.tsx:182-185`, `apps/web/app/teacher/layout.tsx`
- **Issue**: Logout calls `localStorage.removeItem("token")` but the JWT remains valid until expiry. No Redis blacklist or DB revocation table exists.
- **Impact**: Stolen tokens remain usable; no way to invalidate sessions server-side.

### 3. No session management — users cannot view or revoke active sessions (MEDIUM)
- **File**: N/A
- **Issue**: There is no endpoint to list active sessions/devices or revoke a specific session.
- **Impact**: If a user loses a device, they cannot terminate that session without changing their password.

### 4. Google auth is unreachable from UI — no idToken input (MEDIUM)
- **File**: `apps/api/src/modules/auth/auth.controller.ts:26-30`, `apps/web/app/(auth)/login/page.tsx`
- **Issue**: `POST /auth/google` exists but the login page has no Google Sign-In button or idToken paste field.
- **Impact**: Google auth flow is dead code from the user's perspective.

### 5. Mobile auth layouts missing auth redirect (MEDIUM)
- **Files**:
  - `apps/mobile/app/(parent)/(tabs)/_layout.tsx`
  - `apps/mobile/app/(teacher)/(tabs)/_layout.tsx`
- **Issue**: Neither layout checks for a stored token or redirects to `/login` if missing. The web layouts do this in `useEffect`.
- **Impact**: Unauthenticated mobile users can access tab screens without login.

### 6. Login page bypasses `apiFetch` and hardcodes API_URL (LOW)
- **File**: `apps/web/app/(auth)/login/page.tsx:8-10, 39-43, 60-67`
- **Issue**: Uses raw `fetch` with `process.env.NEXT_PUBLIC_API_URL` instead of `getApiUrl()` from `lib/api.ts`.
- **Impact**: If the API URL changes, the login page may break while other pages continue working.

### 7. No rate limiting on auth endpoints (LOW)
- **File**: `apps/api/src/modules/auth/auth.controller.ts`
- **Issue**: `POST /auth/login`, `POST /auth/otp/send`, `POST /auth/register` are not covered by `AuthRateLimitMiddleware` (only applied to `/auth/otp/send` in some configs).
- **Impact**: Brute-force and OTP bombing attacks are possible.

### 8. No MFA/2FA support (LOW)
- **File**: N/A
- **Issue**: No TOTP, SMS second factor, or email second factor implementation.
- **Impact**: Accounts are only as secure as the password/OTP combo.

## Summary

- **2 HIGH**: No refresh token endpoint; no token revocation/blacklist
- **3 MEDIUM**: No session management; Google auth unreachable; mobile auth layouts missing redirect
- **3 LOW**: Login bypasses api.ts; no rate limiting on auth; no MFA

Total: **8 gaps**
