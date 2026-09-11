# Tutor Be Betea (ቱተር በቤቴ)

**Ethiopia's premier home and online tutoring platform**  
Connecting verified tutors with families across Addis Ababa and beyond.

Version: **4.0.0-PROD**

---

## Tech Stack

- **Monorepo**: Turborepo + pnpm + TypeScript
- **Mobile**: React Native + Expo (Universal / Expo Router)
- **Web**: Next.js 15 (App Router)
- **Admin**: Next.js 15 (App Router)
- **Backend**: NestJS
- **Database**: PostgreSQL 16 + PostGIS + pgcrypto (via Prisma)
- **Cache / Realtime**: Upstash Redis + Supabase Realtime
- **Auth**: Supabase Auth (OTP, Google, Email/Password)
- **Video**: LiveKit / Daily.co
- **Payments**: Telebirr + CBE Birr + M-Pesa + Stripe Connect
- **SMS**: AfroMessage (Ethiopia primary)
- **Encryption**: AES-256-GCM (document vault)
- **Audit**: Immutable HMAC-SHA256 ledger
- **Monitoring**: Sentry

---

## Project Structure

```bash
.
├── apps/
│   ├── mobile/     → Parent & Teacher mobile app (React Native + Expo)
│   ├── web/        → Public marketing + discovery website (Next.js 15)
│   ├── admin/      → Super Admin Console (Next.js 15)
│   └── api/        → NestJS Backend API
│
├── packages/
│   ├── types/      → Shared TypeScript types (@tutor/types)
│   ├── ui/         → Shared Design System - Light + Dark theme (@tutor/ui)
│   ├── utils/      → Shared utility functions (@tutor/utils)
│   ├── validators/ → Shared Zod validation schemas (@tutor/validators)
│   ├── encryption/ → AES-256-GCM encrypted document vault (@tutor/encryption)
│   ├── audit/      → Immutable HMAC-SHA256 audit chain (@tutor/audit)
│   ├── geo/        → PostGIS / Haversine geofence helpers (@tutor/geo)
│   ├── database/   → Prisma schema + client (@tutor/database)
│   ├── api-client/ → Shared HTTP API client (@tutor/api-client)
│   └── config/     → Shared ESLint, TypeScript, Tailwind configs (@tutor/config)
│
├── docs/
│   ├── BETA_LAUNCH_CHECKLIST.md
│   ├── E2E_TESTING_CHECKLIST.md
│   ├── PRIVACY_POLICY.md
│   └── TERMS_OF_SERVICE.md
│
├── .github/workflows/
│   ├── ci.yml
│   ├── deploy-admin.yml
│   ├── deploy-api.yml
│   ├── deploy-mobile.yml
│   └── deploy-web.yml
│
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
├── .env.example
├── eas.json
└── README.md
```

---

## Apps

### Mobile (`apps/mobile`)
React Native + Expo universal app with Expo Router for both Parent and Teacher roles.

- **Port**: N/A (runs on device/simulator)
- **Auth Screens**: biometric, login, register, OTP, forgot-password, reset-password, role-select, splash, permissions
- **Parent Tabs**: find-tutors, jobs, messages, profile; plus booking, calendar, children, contract, favorites, notifications, progress, referral, replacement, safety, session-history, subscription, tutors, wallet
- **Teacher Tabs**: contracts, jobs, messages, profile; plus analytics, applications, availability, badges, calendar, connects, earnings, location, onboarding, progress, risk-flag, verification
- **Shared**: camera-capture, chat, location-sharing, notification-center, offline-session, settings, sos-confirm, support
- **Key Libraries**: expo-notifications, expo-location, expo-document-picker, react-native-maps, socket.io-client, zustand

### Web (`apps/web`)
Public marketing + authenticated discovery website (Next.js 15 App Router).

- **Port**: 3000
- **Marketing Pages**: home, about, blog, contact, pricing, testimonials, how-it-works, for-parents, for-tutors, referral
- **Auth Pages**: login, register, forgot-password, reset-password, OTP
- **Parent Dashboard**: calendar, chat, checkout, children, contracts, favorites, help, history, jobs, notifications, progress, referral, safety, sessions, settings, subscription, support, tutors, wallet
- **Teacher Dashboard**: analytics, applications, availability, calendar, chat, contracts, earnings, jobs, notifications, onboarding, profile, progress, risk-flag, sessions, settings, verification
- **Dependencies**: @tutor/types, @tutor/ui, @tutor/utils, socket.io-client

### Admin (`apps/admin`)
Super Admin Console for platform operations (Next.js 15 App Router).

- **Port**: 3001
- **Auth**: login
- **Dashboard Modules**: analytics, attendance, audit-logs, contracts, disputes, impersonation, page, payouts, promos, rbac, risk-flags, settings, tickets, users, vault, verification
- **Dependencies**: @tutor/types, @tutor/ui, @tutor/utils

### API (`apps/api`)
NestJS backend powering all applications.

- **Port**: 4000
- **Entry Point**: `src/main.ts`
- **Feature Modules (25+)**:
  - `auth` — Login, register, OTP, Google auth, JWT strategy
  - `users`, `teachers`, `parents` — User management
  - `jobs`, `matching`, `jobs-queue` — Job posting and matching
  - `contracts`, `attendance`, `progress` — Session management
  - `payments`, `escrow`, `subscriptions` — Financial flows
  - `chat` — WebSocket chat gateway, anti-poaching service
  - `video` — Daily.co / LiveKit integration
  - `vault` — Encrypted document upload
  - `verification` — Admin document review
  - `badges` — Trust badge issuance
  - `reviews`, `favorites`, `referrals`, `replacements` — Social features
  - `notifications`, `support`, `audit`, `admin` — Platform operations
  - `availability` — Teacher scheduling
  - `offline-sync` — Offline attendance sync
  - `blog` — Marketing blog
- **Key Integrations**: Supabase, Upstash Redis, Stripe, LiveKit, Sentry, AfroMessage

---

## Shared Packages

| Package | Purpose |
|---------|---------|
| `@tutor/types` | Shared TypeScript types and interfaces (UserRole, UserStatus, ContractStatus, etc.) |
| `@tutor/ui` | Shared Design System with Light + Dark theme (Button, Input, Card, Avatar, Tabs, Toast, SosButton, GeofenceMarker, etc.) |
| `@tutor/utils` | Shared utilities (generateId, formatETB, formatRelativeTime, maskPhone, sleep) |
| `@tutor/validators` | Shared Zod schemas (User, Teacher, Job, Contract, Attendance, Badge, Vault, Chat) |
| `@tutor/encryption` | AES-256-GCM encrypted document vault (getVaultKey, encryptBuffer, decryptToBuffer) |
| `@tutor/audit` | Immutable HMAC-SHA256 audit chain for admin actions (createAuditHash, verifyAuditHash) |
| `@tutor/geo` | PostGIS helpers and Haversine distance for geofencing (GEOFENCE_RADIUS_METERS = 150m) |
| `@tutor/database` | Prisma ORM for PostgreSQL 16 + PostGIS (20+ models) |
| `@tutor/api-client` | Shared HTTP API client for web and mobile |
| `@tutor/config` | Shared ESLint, TypeScript, Tailwind configuration |

---

## Key Features

- **Escrow-protected payments** with multiple Ethiopian payment providers (Telebirr, CBE Birr, M-Pesa, Stripe)
- **Geofenced attendance** — 150m radius location verification for session check-in/out
- **Encrypted document vault** — AES-256-GCM for sensitive document storage
- **Chat with anti-poaching** — WebSocket chat with regex-based platform contact protection
- **Weekly progress reports** — Structured reporting for parent-tutor communication
- **Trust badges & verification** — Admin-reviewed badge and document verification system
- **Offline sync** — Offline attendance capture with background sync
- **Immutable audit chain** — HMAC-SHA256 ledger for all admin actions
- **Video integration** — LiveKit / Daily.co for virtual sessions
- **Push notifications** — Expo notifications with preference management
- **Referral system** — Built-in referral tracking and rewards
- **Subscription management** — Tutor package and subscription handling

---

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- PostgreSQL 16 + PostGIS + pgcrypto
- Supabase project
- Upstash Redis instance
- AfroMessage account (Ethiopian SMS)

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values. Key variables include:

- **Database**: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Cache**: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- **Auth/Security**: `JWT_SECRET`, `ENCRYPTION_KEY`, `VAULT_MASTER_KEY`, `AUDIT_CHAIN_SECRET`
- **SMS**: `AFROMESSAGE_TOKEN`, `AFROMESSAGE_IDENTIFIER_ID`, `AFROMESSAGE_SENDER_NAME`
- **Payments**: `TELEBIRR_*`, `CBE_BIRR_*`, `STRIPE_*`
- **Video**: `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_URL`
- **App URLs**: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_ADMIN_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_MOBILE_SCHEME`, `EXPO_PUBLIC_API_URL`
- **Monitoring**: `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `EXPO_PUBLIC_SENTRY_DSN`

---

## Scripts

```bash
pnpm install        # Install all dependencies
pnpm dev            # Start all apps in development mode (via Turborepo)
pnpm build          # Build all apps and packages
pnpm lint           # Lint all packages
pnpm check-types    # TypeScript type checking across all packages
pnpm test           # Run tests (none currently implemented)
pnpm clean          # Clean build outputs
pnpm format         # Format code with Prettier
pnpm db:generate    # Generate Prisma client
pnpm db:push        # Push Prisma schema to database
pnpm db:studio      # Open Prisma Studio
```

---

## Development

Start all apps simultaneously:

```bash
pnpm dev
```

Or run individual apps:

```bash
pnpm --filter @tutor/web dev
pnpm --filter @tutor/admin dev
pnpm --filter @tutor/api start:dev
pnpm --filter @tutor/mobile start
```

- **Web**: http://localhost:3000
- **Admin**: http://localhost:3001
- **API**: http://localhost:4000
- **Mobile**: Run `eas start --tunnel` or `expo start` and scan QR code

---

## CI/CD

GitHub Actions pipelines for continuous integration and deployment:

| Workflow | Trigger | Action |
|----------|---------|--------|
| `ci.yml` | Push/PR to main/develop | Install → Prisma generate → Typecheck → Lint → Build |
| `deploy-web.yml` | Push to main (web/** changes) | Deploy to Vercel |
| `deploy-admin.yml` | Push to main (admin/** changes) | Deploy to Vercel |
| `deploy-api.yml` | Push to main (api/** changes) | Deploy to Vercel |
| `deploy-mobile.yml` | Manual dispatch | EAS Build preview (Android APK) |

---

## Documentation

- `docs/PRIVACY_POLICY.md` — Data collection, vault, sharing, and retention policies
- `docs/TERMS_OF_SERVICE.md` — Platform role, payments, escrow, conduct, governing law
- `docs/BETA_LAUNCH_CHECKLIST.md` — Internal beta launch readiness checklist
- `docs/E2E_TESTING_CHECKLIST.md` — End-to-end testing checklist (Auth, Teacher, Parent, Admin, UX flows)

---

## License

Proprietary — Tutor Be Betea (ቱተር በቤቴ). All rights reserved.
