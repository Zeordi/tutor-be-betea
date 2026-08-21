# Tutor Be Betea (ቱተር በቤቴ)

**Ethiopia’s premier home and online tutoring platform**  
Connecting verified tutors with families across Addis Ababa and beyond.

Version: **4.0.0-PROD**

---

## Tech Stack

- **Monorepo**: Turborepo + pnpm + TypeScript
- **Mobile**: React Native + Expo (Universal)
- **Web**: Next.js 15 (App Router)
- **Admin**: Next.js 15
- **Backend**: NestJS
- **Database**: Supabase (PostgreSQL 16 + PostGIS)
- **Cache / Realtime**: Redis + Supabase Realtime
- **Video**: LiveKit / Daily.co
- **Payments**: Telebirr + CBE Birr + M-Pesa + Stripe Connect
- **Auth & Storage**: Supabase Auth + Supabase Storage (Encrypted Vault)

---

## Project Structure

```bash
apps/
  mobile/     → Parent & Teacher mobile app
  web/        → Public marketing + discovery website
  admin/      → Super Admin Console
  api/        → NestJS Backend

packages/
  ui/         → Design System (Light + Dark)
  database/   → Supabase / Prisma schema
  validators/ → Shared Zod schemas
  encryption/ → AES-256 Document Vault
  geo/        → PostGIS helpers
  audit/      → Immutable HMAC ledger
  ...
