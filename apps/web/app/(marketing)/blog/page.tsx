import Link from "next/link";

const ARTICLES = [
  {
    title: "How to Prepare Your Child for the Ethiopian National Exam (Grade 12)",
    cat: "Exam Prep",
    date: "Aug 25, 2026",
    read: "7 min read",
    emoji: "📚",
    desc: "Subject breakdown, practice resources, and how a tutor can help raise scores.",
    featured: true,
  },
  {
    title: "Cambridge IGCSE in Addis Ababa: A Parent’s Complete 2026 Guide",
    cat: "Cambridge Curriculum",
    date: "Aug 18, 2026",
    read: "10 min read",
    emoji: "🎓",
    desc: "Subject choices, grading, and combining Cambridge with the national syllabus.",
    featured: false,
  },
  {
    title: "Tutor Earnings in Ethiopia: How Much Can You Make on Tutor Be Betea?",
    cat: "For Tutors",
    date: "Aug 10, 2026",
    read: "5 min read",
    emoji: "💰",
    desc: "Real earnings patterns and what top tutors do differently.",
    featured: false,
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-black text-[var(--foreground)] md:text-5xl">
            Blog & Resources
          </h1>
          <p className="mx-auto max-w-md text-[var(--secondary)]">
            Ethiopian education, tutoring tips, and platform guides.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {ARTICLES.map((a, i) => (
            <article
              key={a.title}
              className={`overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] ${
                i === 0 ? "md:col-span-1" : ""
              }`}
            >
              <div
                className={`flex items-center justify-center bg-gradient-to-br from-[var(--primary)]/15 to-teal-300/15 ${
                  i === 0 ? "h-52" : "h-40"
                } text-5xl`}
              >
                {a.emoji}
              </div>
              <div className="p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold text-[var(--primary)] dark:bg-teal-950/40">
                    {a.cat}
                  </span>
                  <span className="rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-[11px] text-[var(--secondary)]">
                    {a.read}
                  </span>
                </div>
                <h2
                  className={`mb-2 font-extrabold leading-snug text-[var(--foreground)] ${
                    i === 0 ? "text-xl" : "text-base"
                  }`}
                >
                  {a.title}
                </h2>
                {i === 0 && (
                  <p className="mb-3 text-sm text-[var(--secondary)]">{a.desc}</p>
                )}
                <p className="text-xs text-[var(--secondary)]">{a.date}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-[var(--secondary)]">
          Full article CMS can be wired later — layout matches Figma hub.
        </p>
        <div className="mt-4 text-center">
          <Link
            href="/contact"
            className="text-sm font-bold text-[var(--primary)]"
          >
            Suggest a topic →
          </Link>
        </div>
      </section>
    </main>
  );
}