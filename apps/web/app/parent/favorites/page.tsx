"use client";

import Link from "next/link";

const SAVED = [
  {
    id: "1",
    name: "Selamawit Tadesse",
    sub: "Mathematics · Physics",
    rate: 450,
    rating: 4.9,
    badges: ["🛡️ ID", "🎓 Degree", "🥇 Gold"],
  },
  {
    id: "2",
    name: "Bereket Solomon",
    sub: "Physics · Chemistry",
    rate: 500,
    rating: 4.8,
    badges: ["🛡️ ID", "🎓 Degree"],
  },
];

export default function ParentFavoritesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text)]">Saved Tutors</h1>
        <p className="text-sm text-[var(--secondary)]">
          Tutors you bookmarked for quick booking
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SAVED.map((t) => (
          <Link
            key={t.id}
            href={`/parent/tutors/${t.id}`}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-sm font-black text-white">
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-[var(--text)]">{t.name}</p>
                  <p className="shrink-0 font-extrabold text-[var(--primary)]">
                    {t.rate} ETB/hr
                  </p>
                </div>
                <p className="text-sm text-[var(--secondary)]">{t.sub}</p>
                <p className="mt-1 text-xs text-[var(--secondary)]">⭐ {t.rating}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {t.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950/40 dark:text-teal-200"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {SAVED.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
          <p className="font-bold text-[var(--text)]">No saved tutors yet</p>
          <Link href="/parent/tutors" className="mt-3 inline-block font-bold text-[var(--primary)]">
            Browse tutors →
          </Link>
        </div>
      )}
    </div>
  );
}