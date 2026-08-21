export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl">
              Find Verified Tutors in{" "}
              <span className="text-[var(--primary)]">Addis Ababa</span> & Beyond
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--secondary)]">
              Tutor Be Betea connects families with trusted, verified home and online tutors.
              Safe payments, progress tracking, and real results.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/tutors"
                className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm hover:opacity-90 transition"
              >
                Find a Tutor
              </a>
              <a
                href="/for-tutors"
                className="text-sm font-semibold leading-6 text-[var(--foreground)]"
              >
                Become a Tutor →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <div>
              <p className="text-3xl font-bold text-[var(--primary)]">100%</p>
              <p className="mt-2 text-sm text-[var(--secondary)]">ID Verified Tutors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--primary)]">14-Day</p>
              <p className="mt-2 text-sm text-[var(--secondary)]">Replacement Guarantee</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--primary)]">Escrow</p>
              <p className="mt-2 text-sm text-[var(--secondary)]">Protected Payments</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--primary)]">Progress</p>
              <p className="mt-2 text-sm text-[var(--secondary)]">Weekly Reports</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
