import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-light)] to-[var(--muted)] dark:from-[var(--primary-dark)]/30 dark:to-[var(--background)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-4 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--primary)]" />
                <span className="text-xs font-semibold text-[var(--primary)]">
                  Ethiopia&apos;s #1 Verified Tutoring Platform
                </span>
              </div>
              <h1 className="mb-6 text-4xl font-extrabold leading-tight text-[var(--foreground)] md:text-5xl lg:text-6xl">
                Find Trusted
                <br />
                <span className="text-[var(--primary)]">Verified</span> Tutors
                <br />
                Near You
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-[var(--secondary)]">
                Connect with Fayda-verified, degree-certified tutors across Addis
                Ababa and beyond. Safe sessions, milestone escrow payments, and
                AI-powered progress tracking.
              </p>
              <div className="mb-8 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--primary-dark)]"
                >
                  🔍 Find a Tutor
                </Link>
                <Link
                  href="/for-tutors"
                  className="rounded-xl border-2 border-[var(--primary)] px-6 py-3 text-sm font-bold text-[var(--primary)] hover:bg-[var(--primary-light)]"
                >
                  I&apos;m a Tutor →
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm md:gap-6">
                {[
                  ["🛡️", "12,000+", "Verified Tutors"],
                  ["⭐", "4.9/5", "Parent Rating"],
                  ["🎓", "98%", "Exam Pass Rate"],
                ].map(([icon, val, label]) => (
                  <div key={label}>
                    <p className="font-extrabold text-[var(--foreground)]">
                      {icon} {val}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl bg-gradient-to-br from-[var(--primary-light)] to-[var(--muted)] p-6 shadow-2xl dark:from-[var(--primary-dark)]/40 dark:to-[var(--card)]">
                <div className="absolute -right-3 -top-3">
                  <div className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-900">
                    🥇 Gold Tutor
                  </div>
                </div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)] text-lg font-bold text-white">
                    ST
                  </div>
                  <div>
                    <p className="font-bold text-[var(--foreground)]">
                      Selamawit Tadesse
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Mathematics · Physics · Grade 9–12
                    </p>
                    <p className="mt-0.5 text-xs text-amber-500">★★★★★ 4.9 (86)</p>
                  </div>
                </div>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {["🛡️ National ID", "🎓 Degree", "🥇 Gold", "⭐ Elite"].map((b) => (
                    <span
                      key={b}
                       className="rounded-full bg-[var(--card)]/80 px-2 py-0.5 text-[10px] font-bold text-[var(--foreground)] dark:bg-white/15 dark:text-white"
                    >
                      {b}
                    </span>
                  ))}
                </div>
                <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    ["450 ETB/hr", "Rate"],
                    ["7 yrs", "Experience"],
                    ["128", "Sessions"],
                  ].map(([v, l]) => (
                    <div
                      key={l}
                      className="rounded-xl bg-white/70 py-2 dark:bg-white/15"
                    >
                      <p className="text-sm font-bold text-[var(--foreground)]">
                        {v}
                      </p>
                      <p className="text-[10px] text-[var(--muted-foreground)]">{l}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/register"
                  className="block w-full rounded-xl bg-[var(--primary)] py-3 text-center text-sm font-bold text-white hover:bg-[var(--primary-dark)]"
                >
                  Book a Session
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[var(--muted)] dark:bg-[var(--background)] py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-extrabold text-[var(--foreground)]">
              How Tutor Be Betea Works
            </h2>
            <p className="text-[var(--muted-foreground)]">
              From search to session — safe, verified, effortless
            </p>
          </div>
          <div className="relative grid gap-6 md:grid-cols-4">
            {[
              {
                step: "01",
                icon: "🔍",
                title: "Search & Filter",
                desc: "Find tutors by subject, grade, location, price, and rating. View public Trust Badges.",
              },
              {
                step: "02",
                icon: "📋",
                title: "Post a Job",
                desc: "Create a job listing. Qualified verified tutors apply. You choose.",
              },
              {
                step: "03",
                icon: "💰",
                title: "Secure Escrow",
                desc: "Fund sessions via Telebirr, CBE Birr, or card. Released on milestone completion.",
              },
              {
                step: "04",
                icon: "📊",
                title: "Track Progress",
                desc: "AI-generated reports, attendance tracking, and multi-child dashboards.",
              },
            ].map((s, i) => (
              <div key={s.step} className="relative">
                {i < 3 && (
                  <div className="absolute top-1/2 -right-3 z-10 hidden -translate-y-1/2 text-2xl text-[var(--primary)] md:block">
                    →
                  </div>
                )}
                <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm dark:bg-[var(--card)]">
                  <div className="mb-4 text-4xl">{s.icon}</div>
                  <div className="absolute right-4 top-4 text-xs font-bold text-[var(--muted-foreground)]">
                    {s.step}
                  </div>
                  <h3 className="mb-2 font-bold text-[var(--foreground)]">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--secondary)]">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors — V1 */}
      <section className="bg-[var(--muted)] dark:bg-[var(--background)] py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-[var(--foreground)]">
                Featured Tutors
              </h2>
              <p className="mt-1 text-[var(--muted-foreground)]">
                Top-rated verified professionals in Addis Ababa
              </p>
            </div>
            <Link
              href="/tutors"
              className="shrink-0 rounded-xl border border-[var(--primary)] px-4 py-2 text-sm font-bold text-[var(--primary)] hover:bg-[var(--primary-light)]"
            >
              View All Tutors →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Selamawit Tadesse",
                subjects: "Mathematics · Physics · Statistics",
                rating: "4.9",
                reviews: 86,
                rate: 450,
                location: "Bole · 1.2 km",
                badges: ["🛡️ ID", "🎓 Degree", "🥇 Gold", "⭐ Elite"],
                online: true,
              },
              {
                name: "Bereket Solomon",
                subjects: "Physics · Chemistry · Biology",
                rating: "4.8",
                reviews: 64,
                rate: 500,
                location: "Kazanchis · 2.1 km",
                badges: ["🛡️ ID", "🎓 Degree"],
                online: true,
              },
              {
                name: "Tigist Haile",
                subjects: "Mathematics · Statistics · Grade 12",
                rating: "4.7",
                reviews: 42,
                rate: 380,
                location: "Arat Kilo · 3.4 km",
                badges: ["🛡️ ID"],
                online: false,
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)] text-sm font-bold text-white">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                    {t.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[var(--card)]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-[var(--foreground)]">{t.name}</p>
                      <p className="shrink-0 text-sm font-bold text-[var(--primary)]">
                        {t.rate}
                        <span className="text-xs font-normal text-[var(--muted-foreground)]"> ETB/hr</span>
                      </p>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">{t.subjects}</p>
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      ★ {t.rating} ({t.reviews}) · 📍 {t.location}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {t.badges.map((b) => (
                        <span
                          key={b}
                          className="rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-[10px] font-bold text-[var(--primary)] dark:bg-[var(--primary-light)] dark:text-[var(--primary)]"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href="/register"
                    className="flex-1 rounded-xl bg-[var(--primary)] py-2.5 text-center text-xs font-bold text-white hover:bg-[var(--primary-dark)]"
                  >
                    Book Session
                  </Link>
                  <Link
                    href="/tutors"
                    className="flex-1 rounded-xl border border-[var(--primary)] py-2.5 text-center text-xs font-bold text-[var(--primary)] hover:bg-[var(--primary-light)]"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-12 text-white md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-8 md:gap-12 md:grid-cols-2">
            <div>
              <span className="mb-4 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                🛡️ Safety First
              </span>
              <h2 className="mb-6 text-3xl font-extrabold">
                Your Family&apos;s Safety is Our Priority
              </h2>
              <div className="space-y-4">
                {[
                  [
                    "🛡️",
                    "Fayda National ID Verification",
                    "Every tutor verified through Ethiopia's official Fayda biometric system.",
                  ],
                  [
                    "🎓",
                    "Degree Board Verification",
                    "Academic credentials verified with Ethiopian higher education institutions.",
                  ],
                  [
                    "📍",
                    "GPS Geofencing",
                    "Sessions tracked with real-time location verification.",
                  ],
                  [
                    "🔒",
                    "Anti-Poaching Protection",
                    "Chat auto-redacts contact info to prevent off-platform deals.",
                  ],
                  [
                    "🚨",
                    "Emergency SOS",
                    "One-tap emergency alert with live location sharing.",
                  ],
                ].map(([icon, title, desc]) => (
                  <div key={title} className="flex gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 text-lg">
                      {icon}
                    </div>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm text-white/75">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Tutors Verified", "12,847", "🛡️"],
                ["Safe Sessions", "284,000+", "📅"],
                ["Parent Satisfaction", "98.4%", "⭐"],
                ["Replacement Guarantee", "24hr", "🔄"],
              ].map(([label, value, icon]) => (
                <div
                  key={label}
                  className="rounded-2xl bg-white/10 p-5 text-center backdrop-blur"
                >
                  <p className="mb-1 text-3xl">{icon}</p>
                  <p className="text-2xl font-extrabold">{value}</p>
                  <p className="text-sm text-white/75">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[var(--muted)] dark:bg-[var(--background)] py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="mb-10 text-center text-3xl font-extrabold text-[var(--foreground)]">
            What Families Say
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Yeshi Haile",
                role: "Parent · Bole",
                text: "My daughter improved her math score from 54% to 89% in just 3 months. The progress reports are amazing.",
              },
              {
                name: "Abebe Girma",
                role: "Parent · Kazanchis",
                text: "Fayda verification gave me complete peace of mind. I knew exactly who was coming to my home.",
              },
              {
                name: "Hiwot Teklu",
                role: "Parent · Arat Kilo",
                text: "Managing 3 children's tutors from one app is incredible. Escrow means no payment disputes.",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
              >
                <p className="mb-3 text-amber-400">★★★★★</p>
                <p className="mb-4 text-sm leading-relaxed text-[var(--secondary)]">
                  &quot;{t.text}&quot;
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--foreground)]">{t.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="dark:bg-[var(--background)] py-12 md:py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-[var(--foreground)]">
            Ready to find the perfect tutor?
          </h2>
          <p className="mb-8 text-[var(--muted-foreground)]">
            Join 50,000+ families across Ethiopia. First session free on Premium
            plans.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--primary-dark)]"
            >
              🔍 Find a Tutor Now
            </Link>
            <Link
              href="/login"
              className="rounded-xl border-2 border-[var(--primary)] px-6 py-3 text-sm font-bold text-[var(--primary)]"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}