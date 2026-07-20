# Auth & sessions foundation

## Goals (finished-product loop, step 1)

- Protect `/parent/*` and `/teacher/*` (not only `/admin/*`)
- Durable refresh/logout tokens via Redis
- Optional verify-email + forgot/reset-password flows
- Remove non-functional Google/Facebook buttons

## Backend

- `CacheService` uses `REDIS_URL` (ioredis); falls back to memory only when unset
- Refresh validates the stored token and rotates it
- Logout deletes `refresh_token:{userId}`
- New public routes:
  - `POST /api/auth/resend-verification`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
- `EmailService` tries SMTP/Resend when configured, otherwise **logs** the message
- Email send failures **do not** fail registration or password-reset request handlers that catch them
- New accounts are created with `isVerified: true` until a real sending domain is available

## Frontend

- Middleware matcher: `/admin`, `/teacher`, `/parent`, `/dashboard`
- Role gates for parent/teacher/admin (email-verification gate removed)
- NextAuth JWT refresh using `/auth/refresh`
- `/verify-email` and `/reset-password` pages remain available but are not required to use the app

## Railway

- Redis service added to `tutor-be-betea-api`
- `api` service `REDIS_URL=${{Redis.REDIS_URL}}`

## Email note

Railway **blocks outbound SMTP** (ports 587/465 time out to Gmail).

Do **not** rely on Resend’s `onboarding@resend.dev` test sender for production signup —
without a verified domain it only delivers to the Resend account owner and breaks other addresses.

Until you own a domain:

- Leave `RESEND_API_KEY` unset
- Signup/login work without sending mail (messages are logged)

Later, with a verified domain:

1. Set `RESEND_API_KEY` and `EMAIL_FROM=Tutor Be Betea <noreply@yourdomain.com>`
2. Optionally re-enable an email-verification gate in middleware
