import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="section py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <div className="badge mb-4">Ethiopia’s Trusted Tutoring Platform</div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-[var(--foreground)]">
              Find Verified Tutors in Addis Ababa & Beyond
            </h1>
            <p className="text-lg text-[var(--secondary)] mb-8 max-w-xl">
              Tutor Be Betea connects families with trusted, verified home and
              online tutors. Safe payments, progress tracking, and real results.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/register?role=PARENT" className="btn btn-primary">
                Find a Tutor
              </Link>
              <Link href="/for-tutors" className="btn btn-secondary">
                Become a Tutor →
              </Link>
            </div>
          </div>

          <div className="card shadow-sm border border-[var(--border)] bg-[var(--surface)] p-6 rounded-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[var(--surface-2)] p-5">
                <div className="text-3xl font-bold text-[var(--primary)]">100%</div>
                <div className="text-sm text-[var(--secondary)] mt-1">ID Verified Tutors</div>
              </div>
              <div className="rounded-2xl bg-[var(--surface-2)] p-5">
                <div className="text-3xl font-bold text-[var(--primary)]">14-Day</div>
                <div className="text-sm text-[var(--secondary)] mt-1">Replacement Guarantee</div>
              </div>
              <div className="rounded-2xl bg-[var(--surface-2)] p-5">
                <div className="text-3xl font-bold text-[var(--primary)]">Escrow</div>
                <div className="text-sm text-[var(--secondary)] mt-1">Protected Payments</div>
              </div>
              <div className="rounded-2xl bg-[var(--surface-2)] p-5">
                <div className="text-3xl font-bold text-[var(--primary)]">Progress</div>
                <div className="text-sm text-[var(--secondary)] mt-1">Weekly Reports</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="section py-16 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-[var(--foreground)]">Built for Trust & Results</h2>
            <p className="text-[var(--secondary)] max-w-2xl mx-auto">
              Every feature is designed to protect parents, support tutors, and improve student outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6 bg-[var(--background)] border border-[var(--border)] rounded-2xl">
              <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">Verified Tutors</h3>
              <p className="text-[var(--secondary)] text-sm leading-relaxed">
                National ID and education documents are verified through our secure vault before tutors get Trust Badges.
              </p>
            </div>
            <div className="card p-6 bg-[var(--background)] border border-[var(--border)] rounded-2xl">
              <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">Escrow Protection</h3>
              <p className="text-[var(--secondary)] text-sm leading-relaxed">
                Payments are held safely via Telebirr/CBE Birr and only released after verified sessions. Includes a 14-day replacement guarantee.
              </p>
            </div>
            <div className="card p-6 bg-[var(--background)] border border-[var(--border)] rounded-2xl">
              <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">Weekly Progress Reports</h3>
              <p className="text-[var(--secondary)] text-sm leading-relaxed">
                Parents receive clear updates on topics covered, strengths, and areas that need improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section py-20">
        <div className="container">
          <div className="card text-center py-12 px-6 bg-[var(--surface)] border border-[var(--border)] rounded-3xl">
            <h2 className="text-3xl font-bold mb-3 text-[var(--foreground)]">Ready to get started?</h2>
            <p className="text-[var(--secondary)] mb-8 max-w-xl mx-auto">
              Join families and tutors across Addis Ababa who are already using Tutor Be Betea.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/register" className="btn btn-primary">
                Create Account
              </Link>
              <Link href="/how-it-works" className="btn btn-secondary">
                How it Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}