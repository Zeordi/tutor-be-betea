const PIPELINE = [
  { n: 1, icon: "📝", title: "Application", desc: "Profile, subjects, and teaching experience" },
  { n: 2, icon: "🪪", title: "Fayda ID Check", desc: "National ID verified via Ethiopia’s Fayda system" },
  { n: 3, icon: "🎓", title: "Degree Auth.", desc: "University certificate validated with the institution" },
  { n: 4, icon: "👮", title: "Police Check", desc: "Federal clearance where required" },
  { n: 5, icon: "✅", title: "Live on Platform", desc: "Trust badges issued; tutor can accept bookings" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
            About Tutor Be Betea
          </p>
          <h1 className="mb-4 text-4xl font-black text-[var(--foreground)] md:text-5xl">
            Built for Ethiopian families
          </h1>
          <p className="text-lg leading-relaxed text-[var(--secondary)]">
            We connect parents with verified tutors across Addis Ababa and beyond.
            Payments stay in escrow, chat stays on-platform, and credentials stay in
            a private admin vault — only trust badges are public.
          </p>
        </div>

        <h2 className="mb-8 text-center text-2xl font-black text-[var(--foreground)] md:text-3xl">
          5-step Fayda verification pipeline
        </h2>
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-stretch md:gap-0">
          {PIPELINE.map((step, i) => (
            <div key={step.n} className="flex flex-1 items-center">
              <div className="flex-1 px-2 text-center">
                <div
                  className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl ${
                    i === 4
                      ? "border-teal-300 bg-teal-50 dark:bg-teal-950/40"
                      : "border-teal-200 bg-teal-50/80 dark:border-teal-800 dark:bg-teal-950/20"
                  }`}
                >
                  {step.icon}
                </div>
                <p className="mb-1 text-sm font-extrabold text-[var(--foreground)]">
                  {step.title}
                </p>
                <p className="text-[11px] leading-snug text-[var(--secondary)]">
                  {step.desc}
                </p>
              </div>
              {i < 4 && (
                <div className="hidden h-0.5 w-8 shrink-0 bg-teal-200 dark:bg-teal-800 md:block" />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[var(--primary)] to-teal-700 px-8 py-12 text-center text-white dark:from-[#0D2A40] dark:to-[#0A1628]">
          <div className="mb-4 text-5xl">🔄</div>
          <h2 className="mb-3 text-3xl font-black">100% Replacement Guarantee</h2>
          <p className="mx-auto mb-6 max-w-xl text-white/75">
            Not satisfied? We match a new tutor within 24 hours. Escrow funds
            carry over automatically — no questions asked within the guarantee window.
          </p>
        </div>
      </section>
    </main>
  );
}