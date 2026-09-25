export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">Legal</p>
        <h1 className="mb-6 text-4xl font-black text-[var(--foreground)] md:text-5xl">Cookie Policy</h1>
        <p className="mb-8 text-sm text-[var(--secondary)]">Last updated: 2026-09-25</p>

        <div className="space-y-8 text-[15px] leading-relaxed text-[var(--secondary)]">
          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">1. What We Store</h2>
            <p className="mt-2">
              Tutor Be Betea uses minimal client-side storage to keep the Service functional and secure.
            </p>
            <p className="mt-4">
              <strong>Storage Item</strong> &nbsp;|&nbsp; <strong>Purpose</strong> &nbsp;|&nbsp; <strong>Expiry</strong>
              <br />
              Auth token (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">token</code>) &nbsp;|&nbsp; Keeps you signed in &nbsp;|&nbsp; Until you log out or the session expires
              <br />
              Refresh token (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">refresh_token</code>) &nbsp;|&nbsp; Obtains new access tokens &nbsp;|&nbsp; Until you log out or the session expires
              <br />
              User role (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">role</code>) &nbsp;|&nbsp; Determines app layout and permissions &nbsp;|&nbsp; Until you log out or the session expires
              <br />
              Theme preference &nbsp;|&nbsp; Remembers your preferred color scheme &nbsp;|&nbsp; 365 days
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">2. No Third-Party Tracking Cookies</h2>
            <p>
              We do <strong>not</strong> currently set advertising, marketing, or analytics cookies (e.g., Google Analytics, Facebook Pixel). Any optional error tracking (Sentry) runs via API and does not use browser cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">3. Managing Your Data</h2>
            <p>
              You can clear stored tokens at any time by logging out from the app. Clearing your browser&apos;s local storage or site data will also remove theme preferences and auth tokens.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">4. Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy if we introduce new storage mechanisms. The &quot;Last updated&quot; date reflects the most recent revision.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">5. Contact</h2>
            <p>
              For questions about this Cookie Policy, contact us at legal@tutorbebetea.com.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
