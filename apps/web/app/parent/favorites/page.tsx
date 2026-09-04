"use client";

import Link from "next/link";

const SAVED = [
  { id: "1", name: "Berhane Alemu", sub: "Math & Physics", city: "Bole", rate: 450, rating: 4.9, emoji: "👨‍🏫" },
  { id: "2", name: "Selamawit Bekele", sub: "Chemistry & Biology", city: "Yeka", rate: 500, rating: 5.0, emoji: "👩‍🔬" },
  { id: "3", name: "Dawit Haile", sub: "English & Literature", city: "Sarbet", rate: 380, rating: 4.8, emoji: "👨‍💼" },
];

export default function FavoritesPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-black text-[var(--foreground)]">Saved Tutors</h1>
      <p className="mb-8 text-sm text-[var(--secondary)]">
        Tutors you bookmarked for quick booking.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SAVED.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-teal-300 text-2xl">
                {t.emoji}
              </div>
              <span className="text-lg">❤️</span>
            </div>
            <p className="font-extrabold text-[var(--foreground)]">{t.name}</p>
            <p className="mb-3 text-sm text-[var(--secondary)]">
              {t.sub} · {t.city}
            </p>
            <div className="mb-4 flex justify-between text-sm">
              <span className="font-mono font-black text-[var(--primary)]">
                {t.rate} ETB/hr
              </span>
              <span className="font-bold text-amber-500">★ {t.rating}</span>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/parent/tutors/${t.id}`}
                className="flex-1 rounded-xl bg-[var(--primary)] py-2.5 text-center text-sm font-bold text-white"
              >
                View
              </Link>
              <Link
                href="/parent/checkout"
                className="flex-1 rounded-xl border border-[var(--border)] py-2.5 text-center text-sm font-bold text-[var(--foreground)]"
              >
                Book
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}