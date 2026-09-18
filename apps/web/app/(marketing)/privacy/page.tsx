export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">Legal</p>
        <h1 className="mb-6 text-4xl font-black text-[var(--foreground)] md:text-5xl">Privacy Policy</h1>
        <p className="mb-8 text-sm text-[var(--secondary)]">Last updated: 2026-09-18</p>

        <div className="space-y-8 text-[15px] leading-relaxed text-[var(--secondary)]">
          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">1. Introduction</h2>
            <p>Tutor Be Betea (“we”, “our”, “us”) is committed to protecting the privacy and personal data of our users. This Privacy Policy explains how we collect, use, store, and protect your information when you use our tutoring marketplace platform (the “Service”). This policy is drafted in accordance with Ethiopian data protection principles, including purpose limitation and data minimization.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">2. Data Controller</h2>
            <p><strong>Tutor Be Betea</strong> acts as the Data Controller for all personal data processed through the Service.</p>
            <p className="mt-2">Company: Tutor Be Betea<br />Country: Federal Democratic Republic of Ethiopia<br />City: Addis Ababa<br />Contact: legal@tutorbebetea.com<br />Address: Addis Ababa, Ethiopia</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">3. Information We Collect</h2>
            <p className="mt-2 font-semibold text-[var(--foreground)]">Account Information</p>
            <p>Phone number (primary identifier), email address (optional), full name, and user role (teacher, parent/student, or admin).</p>
            <p className="mt-2 font-semibold text-[var(--foreground)]">Location Data</p>
            <p>Teacher home location, session check-in coordinates (latitude/longitude), and preferred teaching zones.</p>
            <p className="mt-2 font-semibold text-[var(--foreground)]">Uploaded Documents</p>
            <p>Identity documents (Fayda National ID), educational certificates, and selfie/liveness photos. All uploaded documents are encrypted at rest via the Vault service.</p>
            <p className="mt-2 font-semibold text-[var(--foreground)]">Transient Data</p>
            <p>OTP codes (stored temporarily in Redis with 5-minute expiry) and push notification tokens.</p>
            <p className="mt-2 font-semibold text-[var(--foreground)]">Usage and Technical Data</p>
            <p>Session history, attendance records, sanitized chat messages, risk flags, support tickets, and audit logs (immutable chain, retained for 7 years).</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">4. Legal Basis for Processing</h2>
            <p>We process your personal data under the following legal bases: contract performance (tutoring contracts, payments, session tracking), legal obligation (Ethiopian regulations, audit trails), legitimate interests (platform security, fraud prevention, customer support), and consent (optional marketing or cross-border transfers).</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">5. How We Use Your Information</h2>
            <p className="mt-2">Account creation and authentication | OTP: 5 minutes<br />Identity and document verification | 7 years or until user deletion<br />Session booking and attendance tracking | 7 years<br />Payment processing and escrow management | Per financial record requirements<br />In-app communication | 7 years<br />Safety and trust monitoring | 7 years (immutable chain)<br />Platform improvement | Indefinite (anonymized)<br />Customer support | 7 years</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">6. Data Storage and Security</h2>
            <p>Encryption at rest: uploaded documents are encrypted via the Vault service. Encryption in transit: TLS 1.2+. Redis stores OTP codes with 5-minute TTL. Audit logs are maintained as an immutable chain with HMAC verification. Database: PostgreSQL with role-based access controls.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">7. Data Residency and Cross-Border Transfers</h2>
            <p>Your personal data is stored and processed within the borders of the Federal Democratic Republic of Ethiopia. Cross-border transfers only occur when explicitly consented to by the user or when required for specific service functionality (e.g., Firebase Cloud Messaging, payment provider APIs).</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">8. Your Rights</h2>
            <p>Under Ethiopian data protection principles, you have the right of access, correction, deletion, and to object to processing. To exercise these rights, contact legal@tutorbebetea.com.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">9. Children&apos;s Privacy</h2>
            <p>Our Service is designed for adult users (18+). Parent and student profiles are managed by adult guardians. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">10. Data Retention Summary</h2>
            <p className="mt-2">OTP codes | 5 minutes (transient)<br />Uploaded ID documents (Vault) | 7 years or until user deletion<br />Attendance logs | 7 years<br />Audit logs (immutable chain) | 7 years<br />Support tickets | 7 years<br />Risk flags | 7 years<br />Account data (after deletion request) | Deleted within 30 days, subject to legal holds</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">11. Third-Party Services</h2>
            <p>We use payment providers (Telebirr, CBE Birr, M-Pesa, Stripe), SMS/OTP provider, push notification service (Firebase Cloud Messaging / Expo Push), optional error tracking (Sentry), and Upstash Redis. Each provider has its own privacy policy.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">12. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. The “Last updated” date at the top indicates when the policy was last revised.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">13. Contact Us</h2>
            <p>Email: legal@tutorbebetea.com<br />Address: Addis Ababa, Federal Democratic Republic of Ethiopia</p>
          </section>
        </div>
      </section>
    </main>
  );
}
