# Privacy Policy

Last updated: 2026-09-18

## 1. Introduction

Tutor Be Betea ("we", "our", "us") is committed to protecting the privacy and personal data of our users. This Privacy Policy explains how we collect, use, store, and protect your information when you use our tutoring marketplace platform (the "Service").

This policy is drafted in accordance with Ethiopian data protection principles, including purpose limitation and data minimization.

## 2. Data Controller

**Tutor Be Betea** acts as the Data Controller for all personal data processed through the Service.

- **Company:** Tutor Be Betea
- **Country:** Federal Democratic Republic of Ethiopia
- **City:** Addis Ababa
- **Contact for privacy matters:** legal@tutorbebetea.com
- **Physical Address:** Addis Ababa, Ethiopia

## 3. Information We Collect

### 3.1 Account Information
- **Phone number** — primary identifier for login and verification
- **Email address** — optional, used for notifications and account recovery
- **Full name** — displayed on teacher/parent profiles
- **User role** — teacher, parent/student, or admin

### 3.2 Location Data
- Teacher home location (address/coordinates)
- Session check-in location (latitude and longitude)
- Preferred teaching zones (teacher-side)

### 3.3 Uploaded Documents
- Identity documents (Fayda National ID front and back)
- Educational certificates (university degree, etc.)
- Selfie/liveness photo (for verification)
- All uploaded documents are encrypted at rest via the Vault service

### 3.4 Transient Data
- **OTP codes** — generated for phone verification; stored temporarily in Redis with a 5-minute expiry
- **Push notification tokens** — device metadata for Firebase/Expo push notifications

### 3.5 Usage and Technical Data
- Session history and attendance records
- Chat messages (with anti-poaching content sanitization applied)
- Risk flags and support tickets
- Audit log entries (immutable chain, retained for 7 years)

## 4. Legal Basis for Processing

We process your personal data under the following legal bases:

- **Contract performance:** to create and manage tutoring contracts, process payments, and track sessions
- **Legal obligation:** to comply with Ethiopian regulations, maintain audit trails, and respond to lawful requests
- **Legitimate interests:** to improve platform security, prevent fraud, and provide customer support
- **Consent:** where explicitly obtained, such as for optional marketing communications or cross-border data transfers

## 5. How We Use Your Information

| Purpose | Data Used | Retention |
|---------|-----------|-----------|
| Account creation and authentication | Phone number, OTP code, name | OTP: 5 minutes |
| Identity and document verification | Uploaded ID documents, selfie, name | 7 years or until user deletion |
| Session booking and attendance tracking | Location data, contract ID, attendance logs | 7 years |
| Payment processing and escrow management | Phone number, payment method details, payout account | Per financial record requirements |
| In-app communication | Chat messages (sanitized) | 7 years |
| Safety and trust monitoring | Risk flags, audit log entries | 7 years (immutable chain) |
| Platform improvement | Aggregated, anonymized usage data | Indefinite (anonymized) |
| Customer support | Name, account info, ticket content | 7 years |

## 6. Data Storage and Security

- **Encryption at rest:** All uploaded documents (ID, certificates) are encrypted via the Vault service before storage
- **Encryption in transit:** All API communication uses TLS 1.2+
- **Redis:** OTP codes are stored with a 5-minute TTL; Redis is used for session and OTP caching
- **Audit logs:** Maintained as an immutable chain with HMAC verification for tamper detection
- **Database:** PostgreSQL with role-based access controls

## 7. Data Residency and Cross-Border Transfers

Your personal data is stored and processed within the borders of the Federal Democratic Republic of Ethiopia.

Cross-border data transfers only occur:
- When explicitly consented to by the user
- When required for specific service functionality (e.g., Firebase Cloud Messaging, payment provider APIs)

## 8. Your Rights

Under Ethiopian data protection principles, you have the following rights:

- **Right of access:** Request a copy of your personal data
- **Right to correction:** Request correction of inaccurate data
- **Right to deletion:** Request deletion of your account and associated data (subject to legal retention requirements)
- **Right to object:** Object to processing of your personal data for direct marketing or legitimate interest purposes

To exercise any of these rights, contact us at legal@tutorbebetea.com.

## 9. Children's Privacy

Our Service is designed for adult users (18+). Parent and student profiles are managed by adult guardians. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately.

## 10. Data Retention Summary

| Data Type | Retention Period |
|-----------|-----------------|
| OTP codes | 5 minutes (transient) |
| Uploaded ID documents (Vault) | 7 years or until user deletion |
| Attendance logs | 7 years |
| Audit logs (immutable chain) | 7 years |
| Support tickets | 7 years |
| Risk flags | 7 years |
| Account data (after deletion request) | Deleted within 30 days, subject to legal holds |

## 11. Third-Party Services

We use the following third-party service providers who may process personal data on our behalf:

- **Payment providers:** Telebirr, CBE Birr, M-Pesa, Stripe
- **SMS/OTP provider:** For phone number verification
- **Push notification service:** Firebase Cloud Messaging / Expo Push
- **Error tracking (optional):** Sentry (if SENTRY_DSN is configured)
- **OTP/session cache:** Upstash Redis

Each provider has its own privacy policy governing the use of your data.

## 12. Changes to This Policy

We may update this Privacy Policy from time to time. The "Last updated" date at the top of this document indicates when the policy was last revised. We encourage you to review this policy periodically.

## 13. Contact Us

For privacy-related questions, concerns, or requests, please contact:

- **Email:** legal@tutorbebetea.com
- **Address:** Addis Ababa, Federal Democratic Republic of Ethiopia
