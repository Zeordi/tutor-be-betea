export default function HomePage() {
  return (
    <main>
      {/* Navbar */}
      <header className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="text-xl font-bold text-[var(--primary)]">
            Tutor Be Betea
          </div>
          <div className="flex items-center gap-3">
            <a href="/for-tutors" className="text-sm font-medium text-[var(--secondary)]">
              For Tutors
            </a>
            <a href="/login" className="btn btn-secondary text-sm px-4 py-2">
              Login
            </a>
            <a href="/register" className="btn btn-primary text-sm px-4 py-2">
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <div className="badge mb-4">Ethiopia’s Trusted Tutoring Platform</div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Find Verified Tutors in Addis Ababa & Beyond
            </h1>
            <p className="text-lg text-[var(--secondary)] mb-8 max-w-xl">
              Tutor Be Betea connects families with trusted, verified home and
              online tutors. Safe payments, progress tracking, and real results.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="/tutors" className="btn btn-primary">
                Find a Tutor
              </a>
              <a href="/for-tutors" className="btn btn-secondary">
                Become a Tutor →
              </a>
            </div>
          </div>

          <div className="card shadow-sm">
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
      <section className="section bg-[var(--surface)]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Built for Trust & Results</h2>
            <p className="text-[var(--secondary)] max-w-2xl mx-auto">
              Every feature is designed to protect parents, support tutors, and improve student outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-xl font-bold mb-2">Verified Tutors</h3>
              <p className="text-[var(--secondary)]">
                National ID and education documents are verified through our secure vault before tutors get Trust Badges.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-2">Escrow Protection</h3>
              <p className="text-[var(--secondary)]">
                Payments are held safely and only released after verified sessions. Includes a 14-day replacement guarantee.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold mb-2">Weekly Progress Reports</h3>
              <p className="text-[var(--secondary)]">
                Parents receive clear updates on topics covered, strengths, and areas that need improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="card text-center py-12 px-6">
            <h2 className="text-3xl font-bold mb-3">Ready to get started?</h2>
            <p className="text-[var(--secondary)] mb-8 max-w-xl mx-auto">
              Join families and tutors across Addis Ababa who are already using Tutor Be Betea.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <a href="/register" className="btn btn-primary">
                Create Account
              </a>
              <a href="/how-it-works" className="btn btn-secondary">
                How it Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-10">
        <div className="container flex flex-col md:flex-row justify-between gap-4 text-sm text-[var(--secondary)]">
          <div>© {new Date().getFullYear()} Tutor Be Betea. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="/for-parents">For Parents</a>
            <a href="/for-tutors">For Tutors</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}