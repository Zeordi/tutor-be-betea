# Supabase Backup & Restore

## Automated backups

- Supabase provides **Point-in-Time Recovery (PITR)** with daily base backups + WAL archives.
- Enable PITR from the Supabase dashboard → Project Settings → **Backups**.
- Retention is typically 7–28 days depending on plan. Confirm current retention before relying on it.

## Manual backup (pg_dump)

```bash
# Dump all tables except prisma_migrations if needed
pg_dump "$DATABASE_URL" \
  --format=custom \
  --file=tutor-backup-$(date +%F).dump \
  --exclude-table-data='prisma_migrations'
```

- Store dumps in a separate object store (e.g. S3 / GCS) with lifecycle policies.
- Verify dumps regularly by restoring to a staging database.

## Restore (PITR)

- Supabase requires **stopping the instance** for a full PITR restore.
- Coordinate a maintenance window; notify users in advance.
- After restore, verify:
  - `SELECT COUNT(*) FROM users;`
  - `SELECT COUNT(*) FROM tutoring_contracts;`
  - `SELECT COUNT(*) FROM attendance_logs;`
  - `SELECT COUNT(*) FROM vault_documents;`
  - `SELECT COUNT(*) FROM payments;`
  - `SELECT COUNT(*) FROM payouts;`

## Restore (pg_restore)

```bash
pg_restore \
  --clean \
  --no-owner \
  --dbname="$DATABASE_URL" \
  tutor-backup-2026-09-18.dump
```

## Post-restore checks

1. Run `pnpm --filter @tutor/database build` to regenerate Prisma client if schema changed.
2. Run API health check: `curl http://localhost:4000/health`.
3. Verify audit chain integrity if `AUDIT_CHAIN_SECRET` was rotated around the backup date.
4. Verify vault decryption works with current `VAULT_MASTER_KEY` / `ENCRYPTION_KEY`.

## Rollback decision matrix

| Scenario | Action |
|----------|--------|
| Bad deploy (no data loss) | Revert deploy, do not restore backup |
| Data corruption (recent) | PITR to last known good timestamp |
| Data corruption (older) | Restore nearest daily backup + replay WAL |
| Key rotation gone wrong | Restore from backup taken **before** rotation |
