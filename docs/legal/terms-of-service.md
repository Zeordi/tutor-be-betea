# Terms of Service

Last updated: 2026-09-18

## 1. Acceptance of Terms

By accessing or using the Tutor Be Betea platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.

## 2. Eligibility

- You must be at least **18 years old** to use this Service.
- Users under 18 may access the Service only through an adult guardian who accepts these Terms on their behalf.
- By creating an account, you represent that you meet the age requirement or have guardian consent.

## 3. Account Registration

- You must provide accurate and complete information during registration.
- You are responsible for maintaining the confidentiality of your account credentials.
- You must notify us immediately of any unauthorized use of your account.
- We reserve the right to suspend or terminate accounts that violate these Terms.

## 4. Platform Role and Tutor Matching

Tutor Be Betea acts as an **intermediary platform** that facilitates connections between independent tutors and students/parents.

- Tutors are **independent contractors**, not employees of Tutor Be Betea.
- No employment relationship is created between tutors and Tutor Be Betea.
- Tutors are responsible for their own tax obligations and compliance with applicable laws.
- We do not guarantee the quality, safety, or legality of any tutoring session.
- We do not endorse any specific tutor or guarantee learning outcomes.

## 5. Session Payments and Escrow

### 5.1 Escrow Mechanism
All payments for tutoring sessions are held in **escrow** via the `PENDING_ESCROW` status until the session is completed.

### 5.2 Escrow Release
Escrow funds are released:
- **Upon session completion** — confirmed by both parties or through attendance verification
- **Auto-release** — automatically released after the contract end date, per the `EscrowService.autoReleaseExpiredContracts` process

### 5.3 Disputes and Escrow Hold
- Escrow funds may be held if a dispute is opened before the release trigger
- Disputes must be raised before escrow release to be considered
- Dispute resolution follows the SupportTicket and RiskFlag workflow documented in our support runbooks

## 6. Payment Methods and Fees

### 6.1 Accepted Payment Methods
- **Telebirr** (Ethiopian mobile money)
- **CBE Birr** (Commercial Bank of Ethiopia digital banking)
- **M-Pesa** (where available)
- **Stripe** (for applicable regions)

### 6.2 Platform Fee
A platform fee of **10%** is applied to each completed session, as defined by `TutoringContract.platformFeePercent`.

### 6.3 Payouts
Tutors may request payout to their linked Telebirr or CBE Birr account. Payout processing times vary by provider.

## 7. Dispute Resolution

### 7.1 Support Ticket Workflow
Disputes are handled through the in-app support system:
1. User opens a support ticket with `reasonType: BILLING` or `reasonType: SAFETY`
2. A support agent reviews the ticket
3. For escrow-related issues, escalation to Finance/Super Admin occurs
4. For trust/document issues, escalation to Verification Officer occurs

### 7.2 Risk Flag System
Serious concerns (safety, fraud, policy violations) may be logged as RiskFlags for administrative review and potential account action.

### 7.3 Governing Law
All disputes arising from these Terms or use of the Service shall be governed by and construed in accordance with the laws of the **Federal Democratic Republic of Ethiopia**.

## 8. Service Availability

- We strive to maintain Service availability but do not guarantee uptime.
- API health status is available at `GET /health`.
- Scheduled maintenance will be communicated in advance when possible.
- We are not liable for any losses resulting from Service unavailability.

## 9. User Conduct

You agree not to:
- Use the Service for any unlawful purpose
- Harass, abuse, or harm other users
- Share false or misleading information
- Attempt to circumvent platform security measures
- Use the Service to facilitate off-platform payments or communication that bypasses our escrow system
- Violate the anti-poaching provisions of our in-app chat

## 10. Content and Intellectual Property

- Content you submit (profile info, chat messages, documents) remains your property.
- By submitting content, you grant us a license to use, store, and display it as necessary to provide the Service.
- We respect intellectual property rights. If you believe content on the Service infringes your rights, contact us at legal@tutorbebetea.com.

## 11. Termination

Either party may terminate use of the Service at any time:
- **By you:** Disable your account through the app settings or contact support
- **By us:** We may suspend or terminate your account for violation of these Terms, fraudulent activity, or legal requirements

Upon termination:
- Outstanding escrow balances are released per the release conditions in Section 5
- Your data is handled per our Privacy Policy retention schedule
- Provisions that by their nature should survive termination shall remain in effect

## 12. Limitation of Liability

To the maximum extent permitted by Ethiopian law:
- Tutor Be Betea shall not be liable for indirect, incidental, special, or consequential damages
- Our total liability shall not exceed the fees paid by you to us in the 12 months preceding the claim
- We are not liable for the acts or omissions of third-party payment providers or tutors

## 13. Changes to Terms

We may modify these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated Terms. The "Last updated" date reflects the most recent revision.

## 14. Contact Information

For questions about these Terms, please contact:

- **Email:** legal@tutorbebetea.com
- **Address:** Addis Ababa, Federal Democratic Republic of Ethiopia
