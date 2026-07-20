# Auth & sessions foundation

## Goals (finished-product loop, step 1)

- Protect `/parent/*` and `/teacher/*` (not only `/admin/*`)
- Durable refresh/logout tokens via Redis
- Working verify-email + forgot/reset-password flows
- Remove non-functional Google/Facebook buttons

## Backend

- `CacheService` uses `REDIS_URL` (ioredis); falls back to memory only when unset
- Refresh validates the stored token and rotates it
- Logout deletes `refresh_token:{userId}`
- New public routes:
  - `POST /api/auth/resend-verification`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
- `EmailService` sends via SMTP when `EMAIL_HOST`/`EMAIL_USER`/`EMAIL_PASS` are set

## Frontend

- Middleware matcher: `/admin`, `/teacher`, `/parent`, `/dashboard`
- Role gates + email-verification gate for parent/teacher
- NextAuth JWT refresh using `/auth/refresh`
- Real `/verify-email` and `/reset-password` pages

## Railway

- Redis service added to `tutor-be-betea-api`
- `api` service `REDIS_URL=${{Redis.REDIS_URL}}`

## SMTP note

Without SMTP credentials, emails are logged on the API (dev fallback). Set production SMTP on Railway for real delivery.
