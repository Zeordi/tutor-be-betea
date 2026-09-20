# Phase K — Launch Ops Gaps

Audited privacy/terms, support process, response targets, beta program, store listing, go-live checklist, and rollout plan on main branch.

## Existing Artifacts (All Present)

| Artifact | Status | Path(s) |
|----------|--------|---------|
| Privacy Policy | ✅ Draft | `docs/PRIVACY_POLICY.md`, `docs/legal/privacy-policy.md`, `apps/web/app/(marketing)/privacy/page.tsx` |
| Terms of Service | ✅ Draft | `docs/TERMS_OF_SERVICE.md`, `docs/legal/terms-of-service.md`, `apps/web/app/(marketing)/terms/page.tsx` |
| Support process | ✅ Complete | `docs/runbooks/05-support-process.md` |
| Response targets / SLA | ✅ Complete | `docs/legal/response-targets.md` |
| Beta program | ✅ Complete | `docs/beta-program.md` |
| Beta known issues | ✅ Complete | `docs/beta-known-issues.md` |
| Beta launch checklist | ✅ Complete | `docs/BETA_LAUNCH_CHECKLIST.md` |
| Store listing prep | ✅ Complete | `docs/store-listing.md` |
| Go-live checklist | ✅ Complete | `docs/go-live-checklist.md` |
| Rollout plan | ✅ Complete | `docs/go-live-rollout-plan.md` |
| E2E testing checklist | ✅ Complete | `docs/E2E_TESTING_CHECKLIST.md` |

## Gaps

### 1. Three divergent versions of Privacy Policy and Terms of Service (HIGH)
- **Files**: 
  - `docs/PRIVACY_POLICY.md` (short, "Last updated: August 2026")
  - `docs/legal/privacy-policy.md` (comprehensive, "Last updated: 2026-09-18", includes data retention table, legal bases, data residency)
  - `apps/web/app/(marketing)/privacy/page.tsx` (renders shorter inline version)
  - `docs/TERMS_OF_SERVICE.md` (short, "Last updated: August 2026")
  - `docs/legal/terms-of-service.md` (comprehensive, "Last updated: 2026-09-18", 14 sections)
  - `apps/web/app/(marketing)/terms/page.tsx` (renders shorter inline version)
- **Issue**: Three separate sources of truth for the same legal content. The `docs/legal/` versions are the most complete and recent. The root `docs/` versions are older summaries. The web app pages render yet another abbreviated inline version.
- **Impact**: Legal risk — if a user views the web page, they see a different (shorter, older) version than what's in `docs/legal/`. Inconsistent terms across platforms.

### 2. Footer links to `/privacy` and `/terms` under marketing layout, but no canonical enforcement (MEDIUM)
- **File**: `apps/web/components/Footer.tsx:111-112`
- **Issue**: Footer links to `/privacy` and `/terms` which resolve to `apps/web/app/(marketing)/privacy/page.tsx` and `apps/web/app/(marketing)/terms/page.tsx`. These pages render inline abbreviated text, not the full `docs/legal/` versions.
- **Impact**: Users reading the web app see incomplete legal text.

### 3. Footer links to `/about` for "Cookie Policy" but no cookie policy exists (MEDIUM)
- **File**: `apps/web/components/Footer.tsx:113`
- **Issue**: Footer has a "Cookie Policy" link pointing to `/about`, but there is no cookie policy document or page anywhere in the repo.
- **Impact**: Legal/compliance gap — EU/ET privacy regulations may require cookie disclosure. Link goes to generic About page.

### 4. Store listing mentions "No full store submission in this phase" — not ready for launch (LOW)
- **File**: `docs/store-listing.md:38`
- **Issue**: Store listing doc says "No full store submission in this phase — only prep". The EAS build notes and screenshot plan exist, but actual store assets (screenshots, app icons, feature graphics) are not in the repo.
- **Impact**: Mobile app cannot be submitted to App Store / Play Store without additional assets.

### 5. Beta program doc references Google Forms and WhatsApp — not platform-native (LOW)
- **File**: `docs/beta-program.md:29,34`
- **Issue**: Beta feedback collection uses Google Forms and WhatsApp group, not the in-app support system (`POST /support` with `reasonType: FEEDBACK`). The doc mentions the in-app form but then relies on external tools.
- **Impact**: Feedback is scattered across platforms, not centralized in the admin dashboard.

### 6. No documented privacy/terms acceptance flow in-app (LOW)
- **File**: N/A
- **Issue**: There is no evidence of a terms acceptance checkbox during registration, nor a "last updated" notification when terms change. The legal docs exist but are not wired into the auth or onboarding flow.
- **Impact**: Users may not have explicitly accepted terms, which could weaken legal enforceability.

### 7. Go-live checklist references `pnpm check-types` but no `check-types` script in root package.json (LOW)
- **File**: `docs/go-live-checklist.md`, root `package.json`
- **Issue**: Checklist says "Run `pnpm check-types`" but the root `package.json` may not have this script (only workspace packages do).
- **Impact**: CI/verification step may fail for new team members following the checklist.

### 8. Rollout plan references `Sentry error volume spikes` but Sentry is optional (LOW)
- **File**: `docs/go-live-rollout-plan.md:15`
- **Issue**: Rollout plan rollback condition includes "Sentry error volume spikes >3x baseline", but Sentry is optional (`SENTRY_DSN` may not be set). If Sentry is not configured, this rollback trigger is blind.
- **Impact**: Rollout decisions may be made without error visibility.

## Summary

- **1 HIGH**: Three divergent versions of Privacy Policy and Terms of Service (root docs, docs/legal, and web app inline)
- **2 MEDIUM**: Web app footer shows abbreviated legal text; "Cookie Policy" link goes to non-existent page
- **5 LOW**: Store listing not ready for submission; beta feedback not centralized; no in-app terms acceptance; checklist script may not exist; rollback condition depends on optional Sentry

Total: **8 gaps**
