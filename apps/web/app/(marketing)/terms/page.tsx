export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">Legal</p>
        <h1 className="mb-6 text-4xl font-black text-[var(--foreground)] md:text-5xl">Terms of Service</h1>
        <p className="mb-8 text-sm text-[var(--secondary)]">Last updated: 2026-09-18</p>

        <div className="space-y-8 text-[15px] leading-relaxed text-[var(--secondary)]">
          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">1. Acceptance of Terms</h2>
            <p>By accessing or using the Tutor Be Betea platform (“Service”), you agree to be bound by these Terms of Service (“Terms”). If you do not agree to these Terms, you may not use the Service.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">2. Eligibility</h2>
            <p>You must be at least <strong>18 years old</strong> to use this Service. Users under 18 may access the Service only through an adult guardian who accepts these Terms on their behalf.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">3. Account Registration</h2>
            <p>You must provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials and must notify us immediately of any unauthorized use. We reserve the right to suspend or terminate accounts that violate these Terms.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">4. Platform Role and Tutor Matching</h2>
            <p>Tutor Be Betea acts as an <strong>intermediary platform</strong> that facilitates connections between independent tutors and students/parents. Tutors are independent contractors, not employees. No employment relationship is created. Tutors are responsible for their own tax obligations and compliance with applicable laws.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">5. Session Payments and Escrow</h2>
            <p className="mt-2 font-semibold text-[var(--foreground)]">Escrow Mechanism</p>
            <p>All payments for tutoring sessions are held in <strong>escrow</strong> via the <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">PENDING_ESCROW</code> status until the session is completed.</p>
            <p className="mt-2 font-semibold text-[var(--foreground)]">Escrow Release</p>
            <p>Escrow funds are released upon session completion (confirmed by both parties or through attendance verification) or auto-released after the contract end date, per the <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">EscrowService.autoReleaseExpiredContracts</code> process.</p>
            <p className="mt-2 font-semibold text-[var(--foreground)]">Disputes and Escrow Hold</p>
            <p>Escrow funds may be held if a dispute is opened before the release trigger. Disputes must be raised before escrow release to be considered. Dispute resolution follows the SupportTicket and RiskFlag workflow.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">6. Payment Methods and Fees</h2>
            <p className="mt-2 font-semibold text-[var(--foreground)]">Accepted Payment Methods</p>
            <p>Telebirr (Ethiopian mobile money), CBE Birr (Commercial Bank of Ethiopia digital banking), M-Pesa (where available), and Stripe (for applicable regions).</p>
            <p className="mt-2 font-semibold text-[var(--foreground)]">Platform Fee</p>
            <p>A platform fee of <strong>10%</strong> is applied to each completed session, as defined by <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">TutoringContract.platformFeePercent</code>.</p>
            <p className="mt-2 font-semibold text-[var(--foreground)]">Payouts</p>
            <p>Tutors may request payout to their linked Telebirr or CBE Birr account. Payout processing times vary by provider.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">7. Dispute Resolution</h2>
            <p className="mt-2 font-semibold text-[var(--foreground)]">Support Ticket Workflow</p>
            <p>Disputes are handled through the in-app support system: user opens a ticket with <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">reasonType: BILLING</code> or <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">reasonType: SAFETY</code>, support agent reviews, and escalates to Finance/Super Admin for escrow issues or Verification Officer for trust/document issues.</p>
            <p className="mt-2 font-semibold text-[var(--foreground)]">Risk Flag System</p>
            <p>Serious concerns (safety, fraud, policy violations) may be logged as RiskFlags for administrative review and potential account action.</p>
            <p className="mt-2 font-semibold text-[var(--foreground)]">Governing Law</p>
            <p>All disputes arising from these Terms or use of the Service shall be governed by and construed in accordance with the laws of the <strong>Federal Democratic Republic of Ethiopia</strong>.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">8. Service Availability</h2>
            <p>We strive to maintain Service availability but do not guarantee uptime. API health status is available at <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">GET /health</code>. We are not liable for any losses resulting from Service unavailability.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">9. User Conduct</h2>
            <p>You agree not to use the Service for any unlawful purpose, harass or harm other users, share false information, circumvent security measures, facilitate off-platform payments, or violate anti-poaching provisions.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">10. Content and Intellectual Property</h2>
            <p>Content you submit remains your property. By submitting content, you grant us a license to use, store, and display it as necessary to provide the Service.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">11. Termination</h2>
            <p>Either party may terminate use of the Service at any time. Upon termination, outstanding escrow balances are released per the release conditions in Section 5, and your data is handled per our Privacy Policy retention schedule.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">12. Limitation of Liability</h2>
            <p>To the maximum extent permitted by Ethiopian law, Tutor Be Betea shall not be liable for indirect, incidental, special, or consequential damages. Our total liability shall not exceed the fees paid by you to us in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">13. Changes to Terms</h2>
            <p>We may modify these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">14. Contact Information</h2>
            <p>Email: legal@tutorbebetea.com<br />Address: Addis Ababa, Federal Democratic Republic of Ethiopia</p>
          </section>
        </div>
      </section>
    </main>
  );
}
