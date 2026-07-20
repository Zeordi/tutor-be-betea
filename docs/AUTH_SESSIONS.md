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

Railway **blocks outbound SMTP** (ports 587/465 time out to Gmail). HTTPS works.

Use **Resend** (HTTP API) in production:

1. Create a free account at https://resend.com
2. Create an API key
3. Set on Railway `api` service:
   - `RESEND_API_KEY=re_...`
   - `EMAIL_FROM=Tutor Be Betea <onboarding@resend.dev>` (Resend test sender), or your verified domain
4. Redeploy `api`

Gmail `EMAIL_HOST`/`EMAIL_USER`/`EMAIL_PASS` still work for **local/Docker** SMTP, but not from Railway.
