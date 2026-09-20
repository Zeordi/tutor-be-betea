# Phase F — Admin Wire Gaps

Audited admin dashboard pages, `adminApi.ts`, and backend `admin.controller.ts` on main branch.

## Endpoint Path Mismatches (adminApi.ts → backend)

| # | Frontend Call | Current Path | Expected Path | Backend Route Exists? |
|---|--------------|-------------|--------------|----------------------|
| 1 | `vaultPending()` | `/vault/pending` | `/admin/vault/pending` | No |
| 2 | `vaultTeacherDocuments(id)` | `/vault/teacher/${id}` | `/admin/vault/teacher/${id}` | No |
| 3 | `vaultDecrypt(documentId)` | `/vault/${id}/decrypt` | `/admin/vault/${id}/decrypt` | No |
| 4 | `contracts()` | `/contracts` | `/admin/contracts` | No |
| 5 | `tickets()` | `/support` | `/admin/support` | No |
| 6 | `ticket(id)` | `/support/${id}` | `/admin/support/${id}` | No |
| 7 | `requestMoreVerification(documentId, reason)` | `/verification/${id}/request-more` | `/admin/verification/${id}/request-more` | No |
| 8 | `revokeVerification(documentId, reason)` | `/verification/${id}/revoke` | `/admin/verification/${id}/revoke` | No |

## Backend Routes Missing from adminApi.ts

| # | Backend Route | Method | Notes |
|---|--------------|--------|-------|
| 9 | `POST /admin/risk-flag/:userId` | POST | `flagRisk` exists in controller but no `adminApi.flagRisk()` |
| 10 | `GET /admin/children/:parentId` | GET | `getChildProfiles` exists but no `adminApi.childProfiles()` and no page uses it |

## Static Shells / Placeholder UI

| # | Page | Issue |
|---|------|-------|
| 11 | `/dashboard/rbac` | Static shell — "Full RBAC management not yet exposed via API." Only shows current admin session. |
| 12 | `/dashboard/disputes` | Reuses support tickets. Action buttons (Release to Tutor, Refund Parent, Escalate) are all disabled. No dispute model. |
| 13 | `/dashboard/analytics` | "Charts panel" is static — "Hook PostHog / custom series here later." |
| 14 | `/dashboard/attendance` | "Live geo map panel" is static — "Wire PostGIS session points here in a later iteration." |
| 15 | `/dashboard/risk-flags` | "Suspend" and "Warn" buttons are not wired to any API call. Only "Clear" works. |
| 16 | `/dashboard/impersonation` | "Recent audit log" section shows hardcoded static data (Yared Bekele entries) instead of real audit logs. |
| 17 | `/dashboard/promos` | "Banners" section shows hardcoded static `BANNERS` array instead of fetching from API. |

## Role Guard Mismatches

| # | Page | Backend Roles | Sidebar Roles | Mismatch? |
|---|------|--------------|--------------|-----------|
| 18 | `/dashboard/impersonation` | SUPER_ADMIN, SUPPORT_AGENT | super only | Yes — support agents can use backend but not see sidebar |

## Pages Affected by Wrong Endpoint Paths

| # | Page | Broken Calls |
|---|------|-------------|
| 19 | `/dashboard/vault` | `adminApi.vaultPending()` → 404 (wrong path, no backend route) |
| 20 | `/dashboard/verification/[id]` | `adminApi.vaultTeacherDocuments(id)` → 404 (wrong path, no backend route) |

## Summary

- **8 endpoint path mismatches** (missing `/admin` prefix or wrong base path)
- **2 backend routes missing from adminApi.ts** (`flagRisk`, `childProfiles`)
- **7 static shells** across RBAC, disputes, analytics, attendance, risk-flags, impersonation, promos
- **1 role guard mismatch** (impersonation sidebar excludes support agents)
- **2 pages broken due to wrong vault paths** (vault page, verification detail page)

Total: **20 gaps**
