# Support Process & Ticket Workflow

## Overview

This runbook documents how support tickets are created, triaged, and resolved across Tutor Be Betea.

## Ticket Opening

### Parents / Teachers (in-app)

- **Path:** In-app "Report a Problem" → support form
- **API:** `POST /support` (live) or `POST /offline/support` (offline sync)
- **Offline behavior:** Tickets created offline are queued and replayed on sync.

### Support Agents (admin dashboard)

- **Ticket list:** `GET /admin/support` (filter by `status`)
- **Risk flags:** `GET /admin/risk-flags`
- **User context:** Agents can inspect ticket submitter history via linked `contractId`.

## Ticket Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `contractId` | `string?` (UUID) | No | Related tutoring contract |
| `submittedBy` | `string` (UUID) | Yes | User ID |
| `reasonType` | `enum` | Yes | `BILLING`, `SAFETY`, `TECHNICAL`, `CONTENT`, `OTHER` |
| `explanation` | `string` | Yes | Free-text description |
| `evidenceAttachmentUrls` | `string[]` | No | URLs to supporting evidence |
| `staffNotes` | `string?` | No | Internal notes from support team |

## Ticket Status Flow

```
OPEN → UNDER_REVIEW → APPROED | REJECTED
```

- **OPEN:** Newly created, awaiting triage
- **UNDER_REVIEW:** Assigned to an agent
- **APPROVED:** Resolution accepted
- **REJECTED:** Resolution rejected or escalation required

## SLA Targets

| Priority | Channel | First Response | Resolution |
|----------|---------|---------------|------------|
| Critical (safety/dispute) | In-app + email | 1 hour | 4 hours |
| High (billing/escrow) | In-app + email | 2 hours | 24 hours |
| Medium (technical) | In-app + email | 4 hours | 48 hours |
| Low (content/feature) | Email | 24 hours | 5 days |

## Escalation Path

1. **SUPPORT_AGENT** — First line; handles triage and routine issues
2. **FINANCE / SUPER_ADMIN** — Escalated for:
   - Escrow-related billing disputes
   - Payout failures or payment provider issues
3. **VERIFICATION_OFFICER** — Escalated for:
   - Trust/document issues
   - ID verification appeals
   - Risk flag appeals (`RiskFlag.appealNote`)

## RiskFlag Creation Flow

RiskFlags are created by admins when a user is flagged for trust/safety concerns.

**Schema:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` (UUID) | Auto-generated |
| `userId` | `string` (UUID) | Flagged user |
| `createdBy` | `string` (UUID) | Admin who created the flag |
| `severity` | `enum` | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `reason` | `string` | Explanation for the flag |
| `resolved` | `boolean` | Default `false` |
| `appealNote` | `string?` | User's appeal, if any |
| `createdAt` | `DateTime` | Auto-set |

**Endpoints:**
- `GET /admin/risk-flags` — List unresolved flags (SUPPORT_AGENT, SUPER_ADMIN)
- `POST /admin/risk-flags/:id/clear` — Clear a flag (SUPER_ADMIN only)

## SupportTicket Schema

**Model:** `SupportTicket` (`support_tickets`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` (UUID) | Auto-generated |
| `contractId` | `string?` (UUID) | Related contract |
| `submittedBy` | `string` (UUID) | Submitting user |
| `reasonType` | `string` | `BILLING`, `SAFETY`, `TECHNICAL`, `CONTENT`, `OTHER` |
| `explanation` | `string` | Description |
| `evidenceAttachmentUrls` | `string[]` | Evidence links |
| `staffNotes` | `string?` | Internal notes |
| `status` | `enum TicketStatus` | `OPEN`, `UNDER_REVIEW`, `APPROVED`, `REJECTED` |
| `createdAt` | `DateTime` | Auto-set |
| `updatedAt` | `DateTime` | Auto-updated |

**Endpoints:**
- `POST /support` — Create ticket (PARENT, TEACHER)
- `GET /support/mine` — List my tickets
- `GET /support` — List all tickets (SUPER_ADMIN, SUPPORT_AGENT, VERIFICATION_OFFICER)
- `GET /support/ticket/:id` — Get single ticket
- `GET /support/contract/:contractId` — Get tickets by contract

## Runbook Links

- [01-backup-restore.md](./01-backup-restore.md)
- [02-seed-and-reset.md](./02-seed-and-reset.md)
- [03-secret-rotation.md](./03-secret-rotation.md)
- [04-observability.md](./04-observability.md)
