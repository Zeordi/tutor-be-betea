## Admin access (team only)

Admin pages live at `/admin/dashboard` and are **not linked publicly**.

### Protection layers
1. Public register allows only `PARENT` / `TEACHER` (never `ADMIN`)
2. Backend login rejects `ADMIN` users whose email is outside `ADMIN_TEAM_EMAILS`
3. Next.js middleware blocks `/admin/*` unless the session role is `ADMIN`
4. Role-based sidebar/header shows Admin Control only after an admin signs in

### Seed your team admins

```bash
cd backend
export DATABASE_URL="..." # Neon production URL
export ADMIN_EMAIL=you@example.com
export ADMIN_TEAM_EMAILS=you@example.com,teammate@example.com
export ADMIN_PASSWORD='your-strong-password'
export ADMIN_FULL_NAME='Platform Admin'
export ADMIN_PHONE=+251911000001
npx prisma db seed
```

On Vercel, set the same `ADMIN_*` vars on **tutor-be-betea-api**, then seed once against Neon.

### Sign in
1. Open https://tutor-be-betea.vercel.app/login
2. Use a seeded team admin email/password
3. You are redirected to `/admin/dashboard` (Admin Control)

### Live ops pages (wired to `/api/admin/*`)
| Page | API | Actions |
|------|-----|---------|
| `/admin/users` | `GET` / `PATCH /admin/users` | Search, enable/disable, mark email verified, approve teacher verification |
| `/admin/verifications` | `GET /admin/verifications` + users `PATCH` | Pending queue + history; approve via `{ approveVerification: true }` |
| `/admin/disputes` | `GET` / `PATCH /admin/disputes` | Open queue + history; **RELEASE** or full **REFUND** only (no partial — Stripe refunds are full) |

Bookings, analytics, and settings under `/admin/*` remain placeholders.
