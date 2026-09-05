import Link from "next/link";

const BENEFITS = [
  {
    icon: "🛡️",
    title: "Fayda-verified tutors only",
    desc: "National ID, degree checks, and trust badges — no anonymous profiles.",
  },
  {
    icon: "💰",
    title: "Escrow-protected payments",
    desc: "Pay with Telebirr or CBE Birr. Funds release after verified sessions.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Multi-child dashboard",
    desc: "Manage several children, subjects, and tutors from one parent account.",
  },
  {
    icon: "📊",
    title: "Weekly progress reports",
    desc: "Mastery scores, attendance, and clear next-session focus areas.",
  },
  {
    icon: "📍",
    title: "Geofenced home sessions",
    desc: "Check-in within 150m of your registered address for attendance proof.",
  },
  {
    icon: "🔄",
    title: "14-day replacement guarantee",
    desc: "Not the right fit? Request a verified replacement through Safety Center.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create parent account",
    desc: "Sign up with phone + OTP. Add children and subjects.",
  },
  {
    step: "02",
    title: "Find or post",
    desc: "Browse Trust Badge tutors or post a job and review applicants.",
  },
  {
    step: "03",
    title: "Fund escrow",
    desc: "Secure the package. Money stays protected until milestones clear.",
  },
  {
    step: "04",
    title: "Track & chat safely",
    desc: "In-app chat with anti-poaching filters, sessions, and reports.",
  },
];

export default function ForParentsPage() {
  return (
    <main className="bg-[var(--background)]">
      {/* Hero */}
      <section className="border-b border-[var(--border)] px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)]">
              For Ethiopian families
            </p>
            <h1 className="mb-4 text-3xl font-black tracking-tight text-[var(--foreground)] md:text-5xl">
              Trusted tutors for your{" "}
              <span className="text-[var(--primary)]">children</span>
            </h1>
            <p className="mb-8 max-w-lg text-base leading-relaxed text-[var(--secondary)] md:text-lg">
              Fayda-verified teachers, escrow payments, GPS attendance, and weekly
              progress — built for parents in Addis Ababa and beyond.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="rounded-xl bg-[var(--primary)] px-8 py-3.5 text-center text-sm font-bold text-white"
              >
                Find a Tutor →
              </Link>
              <Link
                href="/how-it-works"
                className="rounded-xl border border-[var(--border)] px-8 py-3.5 text-center text-sm font-bold text-[var(--foreground)]"
              >
                How it works
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg md:p-8">
            <p className="mb-4 text-sm font-extrabold text-[var(--foreground)]">
              What parents get
            </p>
            <ul className="space-y-3">
              {[
                "Public Trust Badges only — documents stay in admin vault",
                "Telebirr · CBE Birr · card-friendly escrow",
                "In-app chat with contact redaction",
                "Multi-child profiles & package booking",
                "SOS and Safety Center for disputes",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-[var(--secondary)]"
                >
                  <span className="mt-0.5 text-[var(--primary)]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              {[
                ["12k+", "Verified tutors"],
                ["4.9", "Parent rating"],
                ["24h", "Replacement"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  className="rounded-xl bg-teal-50 py-3 dark:bg-teal-950/30"
                >
                  <p className="text-lg font-black text-[var(--primary)]">{v}</p>
                  <p className="text-[10px] text-[var(--secondary)]">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-b border-[var(--border)] bg-slate-50 px-4 py-14 dark:bg-[#0D1B33] md:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-2xl font-black text-[var(--foreground)] md:text-3xl">
            How parents use Tutor Be Betea
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
              >
                <span className="absolute right-4 top-4 text-xs font-bold text-slate-200 dark:text-slate-700">
                  {s.step}
                </span>
                <h3 className="mb-2 pr-8 font-extrabold text-[var(--foreground)]">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--secondary)]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-14 md:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-2xl font-black text-[var(--foreground)] md:text-3xl">
            Built for peace of mind
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
              >
                <div className="mb-3 text-2xl">{b.icon}</div>
                <h3 className="mb-1.5 text-base font-extrabold text-[var(--foreground)]">
                  {b.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--secondary)]">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border)] bg-gradient-to-br from-teal-700 to-teal-900 px-4 py-14 text-center text-white md:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-3 text-2xl font-black md:text-3xl">
            Start with a verified tutor today
          </h2>
          <p className="mb-8 text-sm text-teal-100 md:text-base">
            Join thousands of families who choose escrow, badges, and clear progress
            over informal arrangements.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-teal-800"
            >
              Create parent account
            </Link>
            <Link
              href="/tutors"
              className="rounded-xl border border-white/40 px-8 py-3.5 text-sm font-bold text-white"
            >
              Browse tutors
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}