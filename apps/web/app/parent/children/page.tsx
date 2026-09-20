"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type Child = {
  id: string;
  studentName: string;
  gradeLevel: string;
  curriculum: string;
  subjects: string[];
  specialLearningNotes: string | null;
  contracts?: { id: string; status: string; teacherId: string }[];
  createdAt?: string;
};

export default function ChildrenPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<Child[]>(paths.children)
      .then((data) => {
        if (!cancelled) {
          setChildren(data || []);
          if (data && data.length > 0) setSelectedIdx(0);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load children");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const c = children[selectedIdx];
  const activeContracts = c?.contracts?.filter((ct) => ct.status === "ACTIVE").length || 0;

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="h-5 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800 mb-3" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-2 h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7">
          <div className="h-64 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
          My children
        </p>
        {children.map((ch, i) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => setSelectedIdx(i)}
            className={`mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left ${
              selectedIdx === i
                ? "border border-teal-300 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30"
                : "border border-transparent"
            }`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-teal-300 text-xl">
              {ch.studentName[0]}
            </span>
            <span>
              <span className="block text-sm font-bold text-[var(--foreground)]">
                {ch.studentName}
              </span>
              <span className="text-xs text-[var(--secondary)]">
                {ch.gradeLevel} · {ch.curriculum?.replace(/_/g, " ").split(" ").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ")}
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
        {children.length === 0 && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
            <p className="font-bold text-[var(--foreground)]">No children added yet</p>
            <p className="mt-1 text-sm text-[var(--secondary)]">
              Children profiles help track sessions and progress.
            </p>
            <Link
              href="/parent/children/add"
              className="mt-4 inline-block font-bold text-[var(--primary)]"
            >
              Add a child →
            </Link>
          </div>
        )}

        {children.length > 0 && c && (
          <>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7">
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-teal-300 text-3xl">
                  {c.studentName[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-black text-[var(--foreground)]">{c.studentName}</h1>
                  <p className="text-sm text-[var(--secondary)]">
                    {c.gradeLevel} · {c.curriculum?.replace(/_/g, " ").split(" ").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ")}
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
                  ["Grade level", c.gradeLevel],
                  ["Curriculum", c.curriculum?.replace(/_/g, " ").split(" ").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ") || "—"],
                  ["Active contracts", String(activeContracts)],
                  ["Added", new Date(c.createdAt || new Date()).toLocaleDateString()],
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

            {c.subjects && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <p className="mb-3 font-extrabold text-[var(--foreground)]">Subjects enrolled</p>
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
            )}

            {c.specialLearningNotes && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <p className="mb-3 font-extrabold text-[var(--foreground)]">Special Notes</p>
                <p className="text-sm text-[var(--secondary)]">{c.specialLearningNotes}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
