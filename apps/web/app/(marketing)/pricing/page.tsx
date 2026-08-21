export default function PricingPage() {
  return (
    <main className="min-h-screen py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h1 className="text-4xl font-bold text-[var(--foreground)]">Simple & Transparent</h1>
        <p className="mt-6 text-lg text-[var(--secondary)]">
          No hidden fees. Parents pay the tutor rate + small platform fee.
          Tutors keep the majority of their earnings.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] p-8 bg-[var(--surface)]">
            <h3 className="text-2xl font-bold">For Parents</h3>
            <p className="mt-4 text-[var(--secondary)]">
              Pay only for completed sessions. Escrow protection included.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] p-8 bg-[var(--surface)]">
            <h3 className="text-2xl font-bold">For Tutors</h3>
            <p className="mt-4 text-[var(--secondary)]">
              Competitive platform fee with performance-based benefits.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
