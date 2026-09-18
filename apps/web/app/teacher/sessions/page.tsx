"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type Contract = {
  id: string;
  subject: string;
  studentName: string;
  parentName: string;
  schedule: string;
  location?: string;
  meetingMode?: string;
  status: "ACTIVE" | "COMPLETED" | "PAUSED" | "INACTIVE";
  agreedAmount: number;
  sessionCredits: number;
  maxCredits: number;
};

function statusClass(s: string) {
  if (s === "ACTIVE")
    return "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40";
  if (s === "COMPLETED")
    return "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300";
  if (s === "PAUSED")
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/30";
  return "bg-[var(--muted)] text-[var(--secondary)]";
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffHrs = (d.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (diffHrs > -1 && diffHrs < 24 && Math.abs(diffHrs) < 24) {
    if (diffHrs < 0) return "Completed";
    if (diffHrs < 2) return "In ~1 hr";
    return `Today · ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  if (diffHrs < 0) return `Completed · ${d.toLocaleDateString()}`;
  return `${d.toLocaleDateString()} · ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function placeText(c: Contract) {
  if (c.meetingMode === "ONLINE") return "Online";
  return c.location || "In person";
}

export default function TeacherSessionsIndexPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<Contract[]>(paths.contractsTeacher)
      .then((data) => {
        if (!cancelled) setContracts(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load sessions");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const upcoming = contracts.filter((c) => new Date(c.schedule) >= new Date());
  const completed = contracts.filter((c) => c.status === "COMPLETED");

  if (loading) {
    return (
      <div>
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mb-6 h-4 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--foreground)]">Sessions</h1>
        <p className="text-sm text-[var(--secondary)]">
          Upcoming and recent sessions · open for check-in / details
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          [String(upcoming.length), "Upcoming"],
          [String(completed.length), "Completed this week"],
          ["0", "Needs check-out"],
        ].map(([v, l]) => (
          <div
            key={l}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4"
          >
            <p className="text-2xl font-black text-[var(--primary)]">{v}</p>
            <p className="text-xs text-[var(--secondary)]">{l}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {contracts.map((c) => (
          <Link
            key={c.id}
            href={`/teacher/sessions/${c.id}`}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--primary)]/40 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <p className="font-extrabold text-[var(--foreground)]">{c.subject}</p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${statusClass(c.status)}`}
                >
                  {c.status.toLowerCase()}
                </span>
              </div>
              <p className="text-sm text-[var(--secondary)]">
                {c.parentName} · {c.studentName}
              </p>
              <p className="mt-1 text-xs text-[var(--secondary)]">
                {formatWhen(c.schedule)} · {placeText(c)}
              </p>
            </div>
            <span className="text-sm font-bold text-[var(--primary)]">Open →</span>
          </Link>
        ))}
        {contracts.length === 0 && (
          <p className="text-sm text-[var(--secondary)]">
            No sessions found.
          </p>
        )}
      </div>
    </div>
  );
}
