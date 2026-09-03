"use client";

const STORIES = [
  {
    name: "Hana Mulugeta",
    role: "Parent · Bole",
    child: "Grade 11 Math",
    before: 65,
    after: 88,
    quote:
      "In six weeks my daughter's score jumped from 65% to 88%. The weekly AI reports made it easy to see real progress.",
    emoji: "👩🏾",
  },
  {
    name: "Abel Tesfaye",
    role: "Parent · Yeka",
    child: "Grade 9 Physics",
    before: 52,
    after: 79,
    quote:
      "Escrow payments and the replacement guarantee gave us confidence. The tutor was patient and always prepared.",
    emoji: "👨🏾",
  },
  {
    name: "Tigist Haile",
    role: "Parent · Sarbet",
    child: "Grade 10 Chemistry",
    before: 70,
    after: 91,
    quote:
      "Cambridge + National support in one place. Trust badges and Fayda verification made choosing a tutor simple.",
    emoji: "👩🏽",
  },
];

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
            Real families · Real results
          </p>
          <h1 className="mb-4 text-4xl font-black text-[var(--foreground)] md:text-5xl">
            What Parents Say
          </h1>
          <p className="mx-auto max-w-xl text-[var(--secondary)]">
            Grade improvement stories from families across Addis Ababa using
            verified tutors and escrow-protected sessions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {STORIES.map((s) => (
            <article
              key={s.name}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-teal-300 text-xl">
                  {s.emoji}
                </div>
                <div>
                  <p className="font-bold text-[var(--foreground)]">{s.name}</p>
                  <p className="text-xs text-[var(--secondary)]">{s.role}</p>
                </div>
              </div>

              <p className="mb-5 text-sm leading-relaxed text-[var(--secondary)]">
                “{s.quote}”
              </p>

              <div className="rounded-xl bg-[var(--muted)] p-4">
                <p className="mb-2 text-xs font-semibold text-[var(--secondary)]">
                  {s.child} · Score change
                </p>
                <div className="mb-2 flex items-end justify-between text-sm font-bold">
                  <span className="text-[var(--secondary)]">{s.before}%</span>
                  <span className="text-[var(--primary)]">{s.after}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--border)]">
                  <div
                    className="h-full rounded-full bg-[var(--primary)]"
                    style={{ width: `${s.after}%` }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}