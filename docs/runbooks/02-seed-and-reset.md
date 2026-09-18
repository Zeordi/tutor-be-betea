# Seed & Reset

## Local / dev reset

```bash
# Push schema to local Postgres
pnpm --filter @tutor/database push

# Generate Prisma client
pnpm --filter @tutor/database build

# Seed if seed script exists
pnpm --filter @tutor/database db:seed
```

## Supabase local reset (if using Supabase CLI)

```bash
supabase db reset
```

## Fresh local database

```bash
# Drop and recreate (Docker example)
docker compose down -v
docker compose up -d

# Then push schema
pnpm --filter @tutor/database push
```

## Key tables to seed for integration tests

- `users` — at least one `PARENT`, one `TEACHER`, one `SUPER_ADMIN`
- `teacher_profiles` — linked to teacher user
- `tutoring_contracts` — status `ACTIVE`, with valid `startDate`/`endDate`
- `attendance_logs` — linked to contract + teacher
- `vault_documents` — status `PENDING` or `APPROVED`

## Do NOT seed in production

- Production data must come from real user flows.
- Seed scripts should be gated by `NODE_ENV !== "production"` where applicable.
