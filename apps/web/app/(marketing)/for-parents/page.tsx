export default function ForParentsPage() {
  return (
    <main className="min-h-screen py-20">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-bold text-[var(--foreground)]">
          For Parents
        </h1>
        <p className="mt-6 text-lg text-[var(--secondary)]">
          Find trusted, verified tutors for your children. Enjoy safe escrow payments,
          weekly progress reports, and a 14-day free replacement guarantee.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] p-6 bg-[var(--surface)]">
            <h3 className="text-xl font-semibold">Verified Tutors Only</h3>
            <p className="mt-3 text-[var(--secondary)]">
              Every tutor passes ID + education verification before appearing on the platform.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] p-6 bg-[var(--surface)]">
            <h3 className="text-xl font-semibold">Protected Payments</h3>
            <p className="mt-3 text-[var(--secondary)]">
              Money is held in escrow and only released after verified sessions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
