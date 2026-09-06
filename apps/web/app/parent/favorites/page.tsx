"use client";

import { useState } from "react";
import Link from "next/link";

type Saved = {
  id: string;
  name: string;
  sub: string;
  rate: number;
  rating: number;
  city: string;
  badges: string[];
};

const INITIAL: Saved[] = [
  {
    id: "1",
    name: "Selamawit Tadesse",
    sub: "Mathematics · Physics",
    rate: 450,
    rating: 4.9,
    city: "Bole",
    badges: ["🛡️ Fayda", "🎓 Degree", "🥇 Gold"],
  },
  {
    id: "2",
    name: "Bereket Solomon",
    sub: "Physics · Chemistry",
    rate: 500,
    rating: 4.8,
    city: "Yeka",
    badges: ["🛡️ Fayda", "🎓 Degree"],
  },
  {
    id: "3",
    name: "Berhane Alemu",
    sub: "Math · National curriculum",
    rate: 420,
    rating: 4.9,
    city: "Sarbet",
    badges: ["🛡️ Fayda", "🎓 Degree", "💎 Elite"],
  },
];

export default function ParentFavoritesPage() {
  const [saved, setSaved] = useState(INITIAL);

  const remove = (id: string) => setSaved((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Saved Tutors</h1>
          <p className="text-sm text-[var(--secondary)]">
            Bookmarked tutors for quick booking · {saved.length} saved
          </p>
        </div>
        <Link
          href="/parent/tutors"
          className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
        >
          Find more tutors
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {saved.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
          >
            <div className="mb-4 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)] text-sm font-black text-white">
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-[var(--foreground)]">{t.name}</p>
                  <p className="shrink-0 font-mono text-sm font-extrabold text-[var(--primary)]">
                    {t.rate}
                    <span className="font-sans text-[10px] font-semibold text-[var(--secondary)]">
                      {" "}
                      ETB/hr
                    </span>
                  </p>
                </div>
                <p className="text-sm text-[var(--secondary)]">{t.sub}</p>
                <p className="mt-1 text-xs text-[var(--secondary)]">
                  ⭐ {t.rating} · 📍 {t.city}
                </p>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {t.badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950/40 dark:text-teal-200"
                >
                  {b}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <Link
                href={`/parent/tutors/${t.id}`}
                className="flex-1 rounded-xl bg-[var(--primary)] py-2.5 text-center text-xs font-bold text-white"
              >
                View & book
              </Link>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-xs font-bold text-[var(--secondary)]"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {saved.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <p className="text-3xl">🤍</p>
          <p className="mt-2 font-bold text-[var(--foreground)]">No saved tutors yet</p>
          <p className="mt-1 text-sm text-[var(--secondary)]">
            Bookmark tutors from Find Tutors to book faster later.
          </p>
          <Link
            href="/parent/tutors"
            className="mt-4 inline-block font-bold text-[var(--primary)]"
          >
            Browse tutors →
          </Link>
        </div>
      )}
    </div>
  );
}