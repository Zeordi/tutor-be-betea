# Beta Program

## Overview

This document defines the Tutor Be Betea beta program scope, recruitment, feedback channels, and known limitations.

## Participant Criteria

### Teachers
- **Count:** 10–20 teachers
- **Location:** Addis Ababa
- **Subjects:** Grade 9–12 math and science
- **Requirements:** Verified identity documents, active phone number, willingness to complete onboarding

### Parent-Student Pairs
- **Count:** 30–50 pairs
- **Location:** Addis Ababa (initial cohort)
- **Requirements:** Guardian must be 18+, active phone number, at least one student in grade 9–12

## Recruitment

- **Referral-based:** Existing trusted users invite teachers and parents
- **Direct outreach:** Via existing user base and school communities in Addis Ababa
- **Selection:** Prioritize users with reliable internet/smartphone access for better feedback quality

## Feedback Channels

### In-App Feedback Form
- Submitted via `POST /support` with `reasonType: FEEDBACK`
- Collected offline via `POST /offline/support` and replayed on sync
- Visible to support agents via `GET /admin/support`

### WhatsApp Group
- Qualitative discussion and quick bug reports
- Managed by the beta coordinator
- Not a formal support channel

### Weekly Survey
- Google Forms survey sent every Friday
- Covers session quality, app usability, and feature requests
- Results reviewed in weekly standup

## Monitoring During Beta

- **OTP delivery success rate:** Check daily via SMS provider dashboard
- **Failed check-ins:** Monitor via `GET /admin/attendance`
- **Anti-poaching false positives:** Review chat sanitization logs
- **Support ticket volume:** Track via `GET /admin/support`
- **Daily standup:** 15-minute sync on blockers and feedback themes

## Success Criteria

- At least 10 successful contracts created
- At least 20 verified sessions (check-ins)
- No critical security issues
- Average support response time < 2 hours
- Positive feedback from majority of testers

## Known Limitations

- Payment provider keys must be configured (Telebirr, CBE Birr, M-Pesa)
- SMS provider must be configured; otherwise SMS/OTP fails silently in production
- Sentry is optional but recommended for error visibility
- Redis is required for OTP in production (`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`); memory fallback only works for single-instance dev

## References

- [BETA_LAUNCH_CHECKLIST.md](./BETA_LAUNCH_CHECKLIST.md)
- [05-support-process.md](./runbooks/05-support-process.md)
- [response-targets.md](../legal/response-targets.md)
