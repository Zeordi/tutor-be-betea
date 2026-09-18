# Secret Rotation

## JWT_SECRET

- Rotating invalidates **all existing tokens**.
- Schedule during low-traffic window.
- Steps:
  1. Generate a new 32+ char random secret.
  2. Update `JWT_SECRET` in deployment secrets.
  3. Restart API processes.
  4. Notify active users to re-login (or force token refresh via client logic).

## VAULT_MASTER_KEY / ENCRYPTION_KEY

- Required format: 64-char hex or >=32 chars.
- Rotating requires **re-encrypting all `vault_documents`** rows.
- Steps:
  1. Generate new key.
  2. Run a one-off re-encryption job that:
     - Reads each `encryptedData` blob
     - Decrypts with **old** key
     - Encrypts with **new** key
     - Updates the row
  3. Update `VAULT_MASTER_KEY` / `ENCRYPTION_KEY` env var.
  4. Restart API.
  5. Verify vault decryption via admin panel.
- **Rollback**: keep old key in a secondary env var for 24h if job fails.

## AUDIT_CHAIN_SECRET

- Rotating breaks the HMAC chain for **new logs only**.
- Old logs remain verifiable with the old secret.
- Steps:
  1. Update `AUDIT_CHAIN_SECRET` env var.
  2. Restart API.
  3. New logs will chain from the last `currentHash` of the previous secret.
  4. Keep old secret available for manual verification of historical logs.

## SENTRY_DSN

- Update `SENTRY_DSN` env var to point to a new DSN if rotating Sentry org/project.
- Restart API.
- Verify events arrive in new Sentry project.

## UPSTASH_REDIS_REST_URL / TOKEN

- Update both env vars simultaneously.
- Restart API.
- Verify OTP send/receive flows in staging first.

## Rotation cadence

| Secret | Recommended cadence |
|--------|---------------------|
| `JWT_SECRET` | Every 90 days or on team member departure |
| `VAULT_MASTER_KEY` | Every 180 days |
| `AUDIT_CHAIN_SECRET` | Every 180 days |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | On Redis infra migration |
| `SENTRY_DSN` | On Sentry org/project migration |
