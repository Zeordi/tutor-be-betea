"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "English"];
const TUTORS = [
  { name: "Hana Bekele", sub: "Mathematics", rating: 4.9 },
  { name: "Abel Tesfaye", sub: "Physics", rating: 4.8 },
];

export default function ChildProfileWebPage() {
  const { id } = useParams<{ id: string }>();
  const [curriculum, setCurriculum] = useState<"national" | "cambridge">("national");

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/parent/children" className="text-sm font-semibold text-[var(--secondary)]">
            ← Children
          </Link>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Child Profile</h1>
        </div>
        <button type="button" className="text-sm font-bold text-[var(--primary)]">
          Save
        </button>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)] text-xl font-extrabold text-white">
          LT
        </div>
        <p className="mt-3 text-lg font-extrabold text-[var(--foreground)]">Liya Tadesse</p>
        <p className="text-sm text-[var(--secondary)]">Age 15 · Grade 10 · #{id}</p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">CURRICULUM</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["national", "🇪🇹 Ethiopian National", "Grades 1–12 National Standard"],
              ["cambridge", "🎓 Cambridge / IGCSE", "International curriculum"],
            ] as const
          ).map(([key, label, desc]) => (
            <button
              key={key}
              type="button"
              onClick={() => setCurriculum(key)}
              className={`rounded-2xl border-2 p-4 text-left transition ${
                curriculum === key
                  ? "border-[var(--primary)] bg-[var(--primary)]/5"
                  : "border-[var(--border)]"
              }`}
            >
              <p className={`text-sm font-bold ${curriculum === key ? "text-[var(--primary)]" : "text-[var(--foreground)]"}`}>
                {label}
              </p>
              <p className="mt-1 text-xs text-[var(--secondary)]">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-wide text-[var(--secondary)]">SUBJECTS</p>
          <button type="button" className="text-xs font-bold text-[var(--primary)]">+ Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s, i) => (
            <span
              key={s}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                i < 3
                  ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--secondary)]"
              }`}
            >
              {s}{i < 3 ? " ×" : ""}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-wide text-[var(--secondary)]">ASSIGNED TUTORS</p>
          <Link href="/parent/tutors" className="text-xs font-bold text-[var(--primary)]">+ Add Tutor</Link>
        </div>
        <div className="space-y-2">
          {TUTORS.map((t) => (
            <div key={t.name} className="flex items-center gap-3 rounded-xl bg-[var(--muted)] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] font-bold text-white">
                {t.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[var(--foreground)]">{t.name}</p>
                <p className="text-xs text-[var(--secondary)]">{t.sub} · {t.rating} ⭐</p>
              </div>
              <button type="button" className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-500">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}