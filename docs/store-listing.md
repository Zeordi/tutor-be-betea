# Store Listing

## App Information

- **App name:** Tutor Be Betea
- **Platforms:** iOS, Android
- **Bundle ID / Package:** `com.tutorbebetea.app`
- **EAS Project ID:** `cde2daf6-f52a-45ec-a7c2-2b96f8b994d2`
- **Trademark note:** Verify no trademark conflict before submission

## Short Description

Ethiopian tutoring marketplace — connect with verified teachers, secure escrow payments, offline session tracking.

## Full Description

- Find tutors by subject, grade, and curriculum (Cambridge IGCSE, American, IB, Ethiopian National Ministry)
- Verified teacher profiles with ID and education badges
- Secure session-based payments with escrow
- Offline-capable attendance tracking
- In-app chat with anti-poaching protection

## Screenshot Plan

1. Teacher profile / verification badges
2. Session booking / contract creation
3. Check-in with geofence
4. Payment / escrow flow
5. Chat interface

## EAS Build Notes

- **Profiles:** Define `production` and `preview` profiles in `eas.json`
- **Required env vars:**
  - `API_URL`
  - `SENTRY_DSN`
- **Build command:** `eas build --platform all --profile production`
- **Note:** No full store submission in this phase — only prep

## App Store Privacy Details

| Data Type | Usage | Linked to User |
|-----------|-------|----------------|
| Name | Profile display | Yes |
| Email (optional) | Notifications / recovery | Yes |
| Phone number | Auth / verification | Yes |
| Location | Session check-in / teacher zones | Yes |
| User-generated content | Chat, documents | Yes |
| Search history | Tutor search / job applications | Yes |

- **Data used for tracking:** No
- **Data not linked to user:** Crash data (if Sentry enabled)

## Mobile App Config

`apps/mobile/app.json` exists and contains basic metadata:
- Name: Tutor Be Betea
- Bundle identifier: `com.tutorbebetea.app`
- EAS project ID: `cde2daf6-f52a-45ec-a7c2-2b96f8b994d2`
- Scheme: `tutorbebetea`

No metadata changes required at this time.
