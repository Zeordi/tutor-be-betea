"use client";

import { useState } from "react";
import Link from "next/link";

const CHILDREN = [
  {
    name: "Kidist Tadesse",
    grade: "10",
    school: "Sandford International",
    cur: "Cambridge",
    emoji: "👧",
    subjects: ["Math", "Physics", "Chemistry"],
  },
  {
    name: "Dawit Tadesse",
    grade: "7",
    school: "Bole Int. School",
    cur: "National",
    emoji: "👦",
    subjects: ["Math", "English", "Amharic"],
  },
];

export default function ChildrenPage() {
  const [idx, setIdx] = useState(0);
  const c = CHILDREN[idx];

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
          My children
        </p>
        {CHILDREN.map((ch, i) => (
          <button
            key={ch.name}
            type="button"
            onClick={() => setIdx(i)}
            className={`mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left ${
              idx === i
                ? "border border-teal-300 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30"
                : "border border-transparent"
            }`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-teal-300 text-xl">
              {ch.emoji}
            </span>
            <span>
              <span className="block text-sm font-bold text-[var(--foreground)]">
                {ch.name}
              </span>
              <span className="text-xs text-[var(--secondary)]">
                Grade {ch.grade} · {ch.cur}
              </span>
            </span>
          </button>
        ))}
        <Link
          href="/parent/children/add"
          className="mt-2 block rounded-xl border border-dashed border-[var(--border)] py-3 text-center text-sm font-bold text-[var(--primary)]"
        >
          + Add child profile
        </Link>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7">
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-teal-300 text-3xl">
              {c.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black text-[var(--foreground)]">{c.name}</h1>
              <p className="text-sm text-[var(--secondary)]">
                Grade {c.grade} · {c.school}
              </p>
            </div>
            <button
              type="button"
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold"
            >
              ✏️ Edit
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Grade level", `Grade ${c.grade}`],
              ["School", c.school],
              ["Curriculum", c.cur],
              ["Active since", "March 2026"],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--secondary)]">
                  {label}
                </p>
                <div className="rounded-[10px] border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2.5 text-sm font-semibold">
                  {val}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="mb-4 font-extrabold text-[var(--foreground)]">Subjects enrolled</p>
          <div className="flex flex-wrap gap-2">
            {c.subjects.map((s) => (
              <span
                key={s}
                className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-[var(--primary)] dark:bg-teal-950/40"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}