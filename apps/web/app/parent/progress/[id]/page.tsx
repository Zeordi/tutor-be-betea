"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const SUBJECTS = [
  { name: "Algebra", score: 88, prev: 79, hw: 90 },
  { name: "Geometry", score: 82, prev: 75, hw: 85 },
  { name: "Statistics", score: 91, prev: 84, hw: 95 },
  { name: "Functions", score: 76, prev: 70, hw: 80 },
];

export default function ParentProgressDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/parent/progress" className="text-sm font-semibold text-[var(--secondary)] hover:text-[var(--primary)]">
          ← Progress
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Progress Report</h1>
          <p className="text-sm text-[var(--secondary)]">Liya Tadesse · Session 18 · Oct 12 · #{id}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] font-extrabold text-white">
            LT
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-[var(--foreground)]">Liya Tadesse</p>
            <p className="text-sm text-[var(--secondary)]">Grade 10 · Mathematics · National</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            On Track
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["87%", "Mastery"],
            ["92%", "Attend."],
            ["4.8★", "Rating"],
            ["18", "Sessions"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl bg-[var(--muted)] p-3 text-center">
              <p className="text-sm font-extrabold text-[var(--primary)]">{v}</p>
              <p className="text-[10px] text-[var(--secondary)]">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-[#0f766e] p-5 text-white">
        <div className="mb-2 flex items-center gap-2">
          <span>🤖</span>
          <span className="text-xs font-extrabold tracking-wide">AI-GENERATED INSIGHT</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">Session 18</span>
        </div>
        <p className="text-sm leading-relaxed text-white/90">
          Liya demonstrates strong upward momentum in algebra and statistics. Geometry requires 2–3
          targeted sessions before the national exam. Homework completion rate of 90% is excellent.
        </p>
        <p className="mt-2 text-xs text-white/65">ሊያ ቁጥርን ከ 79% ወደ 88% አሻሽላለች።</p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">SUBJECT SCORES · VS LAST MONTH</p>
        <div className="space-y-4">
          {SUBJECTS.map((s) => (
            <div key={s.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-semibold text-[var(--foreground)]">{s.name}</span>
                <span className="text-[var(--secondary)]">
                  Was {s.prev}% <span className="font-extrabold text-emerald-500">↑ {s.score}%</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${s.score}%` }} />
              </div>
              <p className="mt-1 text-[10px] text-[var(--secondary)]">HW completion: {s.hw}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="mb-2 text-sm font-bold text-emerald-600">✅ Strengths</p>
          {["Algebraic manipulation", "Self-correction habit", "Consistent homework"].map((x) => (
            <p key={x} className="mb-1 text-sm text-[var(--foreground)]">• {x}</p>
          ))}
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="mb-2 text-sm font-bold text-amber-600">⚠ Focus Areas</p>
          {["Geometric proofs", "Word problem setup", "Unit conversion"].map((x) => (
            <p key={x} className="mb-1 text-sm text-[var(--foreground)]">• {x}</p>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" className="rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-extrabold text-white">
          ✅ Approve Report
        </button>
        <Link
          href="/parent/chat/1"
          className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-bold text-[var(--secondary)]"
        >
          💬 Ask Tutor
        </Link>
      </div>
    </div>
  );
}