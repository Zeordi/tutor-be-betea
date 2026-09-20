# Phase J — Docs, Compliance & Seed Gaps

Audited docs, legal, runbooks, seed scripts, and compliance artifacts on main branch.

## Existing Artifacts

| Artifact | Status | Path |
|----------|--------|------|
| README | ✅ Comprehensive | `README.md` |
| Privacy Policy | ✅ Exists | `docs/PRIVACY_POLICY.md`, `docs/legal/privacy-policy.md` |
| Terms of Service | ✅ Exists | `docs/TERMS_OF_SERVICE.md`, `docs/legal/terms-of-service.md` |
| Runbooks | ✅ 5 runbooks | `docs/runbooks/01-backup-restore.md`, `02-seed-and-reset.md`, `03-secret-rotation.md`, `04-observability.md`, `05-support-process.md` |
| Beta program | ✅ Exists | `docs/beta-program.md`, `docs/beta-known-issues.md`, `docs/BETA_LAUNCH_CHECKLIST.md` |
| Go-live docs | ✅ Exists | `docs/go-live-checklist.md`, `docs/go-live-rollout-plan.md` |
| E2E testing | ✅ Exists | `docs/E2E_TESTING_CHECKLIST.md` |
| .env.example | ✅ Comprehensive | `.env.example` (93 lines, all vars documented) |
| SLA / response targets | ✅ Exists | `docs/legal/response-targets.md` |

## Gaps

### 1. No CONTRIBUTING.md (LOW)
- **File**: N/A
- **Issue**: No contributor guide. No instructions for branching, commit conventions, PR process, or code review expectations.
- **Impact**: Onboarding new developers is ad-hoc.

### 2. No SECURITY.md / vulnerability disclosure policy (LOW)
- **File**: N/A
- **Issue**: No security policy documenting how to report vulnerabilities. README mentions "rotate any secret that was ever committed" but no formal disclosure process.
- **Impact**: Security researchers and users have no clear path to report issues.

### 3. No CHANGELOG.md (LOW)
- **File**: N/A
- **Issue**: No changelog tracking releases, breaking changes, or migration notes.
- **Impact**: Hard to track what changed between versions.

### 4. Seed script referenced but does not exist (LOW)
- **File**: `packages/database/package.json`
- **Issue**: `docs/runbooks/02-seed-and-reset.md` references `pnpm --filter @tutor/database db:seed`, but `package.json` has no `db:seed` script. No `seed.ts` or `seed.js` file exists in the database package.
- **Impact**: CI/onboarding cannot run seed data automatically.

### 5. No data retention / deletion policy document (LOW)
- **File**: N/A
- **Issue**: Privacy policy mentions "deleted within 30 days" but there's no engineering-facing data retention runbook covering TTLs, cascade deletes, GDPR-style deletion workflows, or legal hold procedures.
- **Impact**: Engineering may not know retention requirements when designing data flows.

### 6. No incident response runbook (LOW)
- **File**: N/A
- **Issue**: Runbooks cover backup, seed, secrets, observability, and support process, but there's no incident response runbook covering severity definitions, communication channels, escalation paths, and post-mortem process.
- **Impact**: During an outage or security incident, the team has no standardized response procedure.

### 7. No explicit Ethiopian data protection compliance doc (LOW)
- **File**: N/A
- **Issue**: Privacy policy exists but is generic. No Ethiopia-specific data protection compliance notes (e.g., FDRE Personal Data Protection Proclamation considerations, data residency requirements).
- **Impact**: May not meet local regulatory expectations.

## Summary

- **0 HIGH**
- **0 MEDIUM**
- **7 LOW**: Missing CONTRIBUTING.md, SECURITY.md, CHANGELOG.md, seed script, data retention policy, incident response runbook, Ethiopia data protection compliance doc

Total: **7 gaps**
