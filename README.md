Here is a full **updated `README.md`** aligned with the current monorepo, hosting, and product scope.

Copy into `README.md` at the repo root:

```markdown
# Tutor Be Betea (ቱተር በቤቴ)

**Ethiopia’s premier home and online tutoring platform**  
Connecting verified tutors with families across Addis Ababa and beyond.

| | |
|---|---|
| **Version** | 4.0.0 |
| **Monorepo** | Turborepo + pnpm + TypeScript |
| **API** | NestJS on [Render](https://tutor-be-betea.onrender.com) |
| **Web** | Next.js on Vercel |
| **Admin** | Next.js on Vercel |
| **Mobile** | React Native + Expo (EAS) |

---

## Product overview

Tutor Be Betea is a trust-first marketplace for **home and online tutoring** in Ethiopia.

**Parents** can find verified tutors, post jobs, manage multi-child profiles, fund escrow, track sessions (including geofenced check-in), chat on-platform, and review weekly progress.

**Teachers** can build public profiles with trust badges (not raw documents), apply to jobs (Connects economy), manage contracts/earnings, submit progress, and upload credentials into an admin-only encrypted vault.

**Admins** verify identity/education, monitor escrow and disputes, review audit logs, and operate risk/promo/payout tools.

### Trust & safety (core differentiators)

- **Document vault** — Fayda/ID, degrees, and selfies encrypted (AES-256); **admin-only**, never public
- **Trust badges** — National ID Verified, Degree Verified, Gold/Elite signals on profiles
- **Anti-poaching chat** — real-time redaction of phone numbers, emails, Telegram handles, bank accounts
- **Escrow + 14-day replacement style guarantees** (product flow)
- **Geofenced attendance** — check-in/out with distance rules; offline-capable sync on mobile
- **Immutable audit trail** — HMAC-chained admin actions

---

## Tech stack

| Layer | Technology |
|--------|------------|
| Monorepo | Turborepo, pnpm workspaces, TypeScript |
| Mobile | React Native, Expo Router, EAS Build |
| Web / Admin | Next.js (App Router), Tailwind |
| API | NestJS |
| Database | PostgreSQL (Supabase) + Prisma; PostGIS-ready |
| Cache / OTP | Upstash Redis |
| SMS OTP | AfroMessage (Ethiopia-first) |
| Payments (planned / stubs) | Telebirr, CBE Birr, M-Pesa, Stripe |
| Video (stubs) | LiveKit / Daily |
| Design system | `@tutor/ui` — light + dark, teal brand tokens |

### Hosting (current)

| App | Host | URL |
|-----|------|-----|
| API | **Render** (Web Service) | `https://tutor-be-betea.onrender.com` |
| Web | **Vercel** | `https://tutor-be-betea-web.vercel.app` |
| Admin | **Vercel** | `https://tutor-be-betea-admin.vercel.app` |
| Mobile | Expo / EAS | Config: `apps/mobile/eas.json` |

> The Nest API is a long-running Node process. It is **not** deployed as a Vercel serverless function. Prefer **Render** (or Railway) for the API.

---

## Repository structure

```text
tutor-be-betea/
├── apps/
│   ├── api/                 # NestJS backend
│   ├── web/                 # Public site + parent/teacher web dashboards
│   ├── admin/               # Super Admin console
│   └── mobile/              # Expo app (parent + teacher)
│       └── eas.json         # EAS profiles + EXPO_PUBLIC_API_URL → Render
├── packages/
│   ├── ui/                  # Shared design system (tokens, Button, Card, TrustBadges, …)
│   ├── database/            # Prisma schema + client (@tutor/database)
│   ├── validators/          # Shared Zod schemas
│   ├── encryption/          # Vault AES helpers
│   ├── geo/                 # Distance / geofence helpers
│   ├── audit/               # HMAC audit chain helpers
│   ├── api-client/          # Shared API client helpers
│   ├── config/              # ESLint / TS / Tailwind presets
│   ├── types/               # Shared types
│   └── utils/               # Shared utilities
├── .github/workflows/
│   ├── ci.yml               # install, prisma generate, typecheck, lint, build
│   ├── deploy-web.yml       # optional Vercel deploy (web)
│   ├── deploy-admin.yml     # optional Vercel deploy (admin)
│   └── deploy-mobile.yml    # optional EAS preview (manual)
├── .env.example             # Placeholders only — never real secrets
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## Getting started (local / Codespace)

### Prerequisites

- Node.js **≥ 20**
- **pnpm** 9.x (`packageManager`: `pnpm@9.12.0`)
- A Supabase project (Postgres URL)
- Optional: Upstash Redis, AfroMessage token

### Install & run

```bash
# Install dependencies
pnpm install

# Environment (local only — never commit .env)
cp .env.example .env
# Edit .env with real DATABASE_URL, JWT_SECRET, ENCRYPTION_KEY, etc.

# Generate Prisma client
pnpm db:generate

# Optional: push schema to database
pnpm db:push

# Start all apps in development
pnpm dev
```

Typical local ports:

| App | Port |
|-----|------|
| API | `4000` (or `process.env.PORT`) |
| Web | `3000` |
| Admin | `3001` (if configured) |

Point local clients at the API:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
EXPO_PUBLIC_API_URL=http://localhost:4000
```

Or against production API:

```bash
NEXT_PUBLIC_API_URL=https://tutor-be-betea.onrender.com
EXPO_PUBLIC_API_URL=https://tutor-be-betea.onrender.com
```

### Useful scripts

```bash
pnpm install          # install workspace
pnpm dev              # turbo dev (all packages/apps that support it)
pnpm build            # turbo build
pnpm check-types      # turbo typecheck
pnpm lint             # turbo lint
pnpm db:generate      # Prisma generate
pnpm db:push          # Prisma db push
pnpm db:studio        # Prisma Studio
```

---

## Environment variables

See **`.env.example`** for the full template. Rules:

1. **Real secrets only in** local `.env`, Codespace secrets, Vercel project env, Render env, GitHub Actions secrets.
2. **`.env.example` stays placeholders only** — never commit live keys.
3. `NEXT_PUBLIC_*` / `EXPO_PUBLIC_*` are public at build time; do not put private keys there.

Minimum for API (Render / local):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Supabase Postgres (session pooler recommended) |
| `JWT_SECRET` | Auth tokens (≥ 32 chars) |
| `ENCRYPTION_KEY` / `VAULT_MASTER_KEY` | Document vault |
| `AUDIT_CHAIN_SECRET` | Admin audit HMAC chain |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | OTP / cache (optional but recommended) |
| `AFROMESSAGE_*` | SMS OTP |

Web / Admin (Vercel):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | `https://tutor-be-betea.onrender.com` |
| `NEXT_PUBLIC_APP_URL` | Web origin |
| `NEXT_PUBLIC_ADMIN_URL` | Admin origin |

Mobile (EAS / local):

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_API_URL` | Same Render API URL (set in `apps/mobile/eas.json` profiles) |

---

## Auth flow (high level)

1. **Register / login** with phone (Ethiopia-first) + OTP (AfroMessage) and/or password as implemented in API.
2. API issues **JWT**; web stores session via `apps/web/lib/auth.ts` / `api.ts`.
3. Role redirect: **PARENT** → parent dashboard, **TEACHER** → teacher dashboard.
4. Protected routes require a valid token; marketing pages stay public.

Root API URL may return `404 Cannot GET /` — that means Nest is up with no home route. Prefer `/health` if added, or call real routes such as auth endpoints.

---

## Design system

Shared UI lives in **`packages/ui`**:

- Light + dark tokens (teal brand)
- Components: Button, Input, Card, Badge, Avatar, TrustBadges, TutorCard, escrow/status, etc.
- Web/admin: Tailwind + CSS variables
- Mobile: theme hook (`useTheme`) with aliases for consistent tokens

Figma-driven screens were mapped into Expo Router and Next App Router routes; backend modules align to product features (jobs, contracts, attendance, chat, vault, admin).

---

## CI / CD

| Workflow | Role |
|----------|------|
| `ci.yml` | Install, Prisma generate, typecheck, lint, build |
| `deploy-web.yml` / `deploy-admin.yml` | Optional GitHub → Vercel (prefer Vercel Git integration if already connected) |
| `deploy-mobile.yml` | Manual EAS preview (`workflow_dispatch`, needs `EXPO_TOKEN`) |

**Note:** If GitHub Actions Vercel deploy fails with “CLI version outdated”, either upgrade the workflow to `vercel@latest` or rely on **Vercel dashboard** deploys only. API deploys via **Render**, not Vercel.

---

## Production checklist

- [x] API on Render (long-running Nest process)
- [x] Web + Admin on Vercel
- [x] `NEXT_PUBLIC_API_URL` / `EXPO_PUBLIC_API_URL` → Render
- [x] Supabase schema aligned with Prisma
- [ ] SMS OTP verified end-to-end with AfroMessage production credentials
- [ ] Payment gateways live keys (Telebirr / CBE / Stripe as needed)
- [ ] Mobile internal EAS build tested on device
- [ ] Optional: health route on API root
- [ ] Visual parity / polish pass after core API stability

---

## Security notes

- Never commit `.env` or real tokens.
- Vault documents are encrypted and admin-scoped.
- Chat sanitization reduces off-platform disintermediation and supports dispute auditability.
- Rotate any secret that was ever committed or shared in chat.

---

## License / contact

Private product repository.  
Product: **Tutor Be Betea** — home & online tutoring for Ethiopia.

For local issues: check API logs on Render, Vercel function/build logs for web/admin, and `pnpm check-types` / `pnpm build` in CI.
```

---

### What changed vs the old README

- Documented **Render API** + Vercel web/admin + Expo mobile  
- Expanded **structure** (`packages/*`, workflows, `eas.json` location)  
- Added **getting started**, scripts, env tables, auth overview  
- Trust features and design-system notes  
- CI/CD and production checklist reflecting current reality  

Paste into the repo, commit, and push when ready.