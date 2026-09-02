import Link from "next/link";

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 dark:border-teal-800 dark:bg-teal-900/30">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
                <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                  Ethiopia&apos;s #1 Verified Tutoring Platform
                </span>
              </div>
              <h1 className="mb-6 text-4xl font-extrabold leading-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl">
                Find Trusted
                <br />
                <span className="text-teal-600">Verified</span> Tutors
                <br />
                Near You
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Connect with Fayda-verified, degree-certified tutors across Addis
                Ababa and beyond. Safe sessions, milestone escrow payments, and
                AI-powered progress tracking.
              </p>
              <div className="mb-8 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white hover:bg-teal-700"
                >
                  🔍 Find a Tutor
                </Link>
                <Link
                  href="/for-tutors"
                  className="rounded-xl border-2 border-teal-600 px-6 py-3 text-sm font-bold text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                >
                  I&apos;m a Tutor →
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {[
                  ["🛡️", "12,000+", "Verified Tutors"],
                  ["⭐", "4.9/5", "Parent Rating"],
                  ["🎓", "98%", "Exam Pass Rate"],
                ].map(([icon, val, label]) => (
                  <div key={label}>
                    <p className="font-extrabold text-slate-900 dark:text-white">
                      {icon} {val}
                    </p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl bg-gradient-to-br from-teal-100 to-blue-100 p-6 shadow-2xl dark:from-teal-900/30 dark:to-blue-900/30">
                <div className="absolute -right-3 -top-3">
                  <div className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-900">
                    🥇 Gold Tutor
                  </div>
                </div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-lg font-bold text-white">
                    ST
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">
                      Selamawit Tadesse
                    </p>
                    <p className="text-xs text-slate-500">
                      Mathematics · Physics · Grade 9–12
                    </p>
                    <p className="mt-0.5 text-xs text-amber-500">★★★★★ 4.9 (86)</p>
                  </div>
                </div>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {["🛡️ National ID", "🎓 Degree", "🥇 Gold", "⭐ Elite"].map((b) => (
                    <span
                      key={b}
                      className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200"
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
                      className="rounded-xl bg-white/60 py-2 dark:bg-white/10"
                    >
                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                        {v}
                      </p>
                      <p className="text-[10px] text-slate-500">{l}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/register"
                  className="block w-full rounded-xl bg-teal-600 py-3 text-center text-sm font-bold text-white hover:bg-teal-700"
                >
                  Book a Session
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-20 dark:bg-[#0D1B33]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-extrabold text-slate-900 dark:text-white">
              How Tutor Be Betea Works
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              From search to session — safe, verified, effortless
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
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
            ].map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/80"
              >
                <div className="mb-4 text-4xl">{s.icon}</div>
                <div className="absolute right-4 top-4 text-xs font-bold text-slate-200 dark:text-slate-700">
                  {s.step}
                </div>
                <h3 className="mb-2 font-bold text-slate-800 dark:text-white">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
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
                      <p className="text-sm text-teal-200">{desc}</p>
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
                  <p className="text-sm text-teal-200">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-20 dark:bg-[#0D1B33]">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-10 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
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
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/80"
              >
                <p className="mb-3 text-amber-400">★★★★★</p>
                <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  &quot;{t.text}&quot;
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-slate-900 dark:text-white">
            Ready to find the perfect tutor?
          </h2>
          <p className="mb-8 text-slate-500 dark:text-slate-400">
            Join 50,000+ families across Ethiopia. First session free on Premium
            plans.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white hover:bg-teal-700"
            >
              🔍 Find a Tutor Now
            </Link>
            <Link
              href="/login"
              className="rounded-xl border-2 border-teal-600 px-6 py-3 text-sm font-bold text-teal-600"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}