"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type Session = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  teacher: { fullName: string; avatarUrl: string | null };
  student: { studentName: string };
};

export default function ParentSessionsIndexPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contracts, setContracts] = useState<Session[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<Session[]>(paths.contractsParent)
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

  const upcoming = contracts.filter((c) => c.status === "PENDING_ESCROW" || c.status === "ACTIVE");
  const completed = contracts.filter((c) => c.status === "COMPLETED");
  const needsConfirmation = contracts.filter((c) => c.status === "ACTIVE");

  function statusStyle(s: string) {
    if (s === "ACTIVE") return "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40";
    if (s === "PENDING_ESCROW") return "bg-amber-50 text-amber-700 dark:bg-amber-900/30";
    return "bg-[var(--muted)] text-[var(--secondary)]";
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">Sessions</h1>
          <p className="text-sm text-[var(--secondary)]">
            Upcoming and recent sessions · open a session for check-in details
          </p>
        </div>
        <Link
          href="/parent/history"
          className="text-sm font-bold text-[var(--primary)]"
        >
          Full history & invoices →
        </Link>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          [String(upcoming.length), "Upcoming"],
          [String(completed.length), "This week done"],
          [String(needsConfirmation.length), "Needs confirmation"],
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

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl border border-[var(--border)] bg-slate-100 dark:bg-slate-800"
            />
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {contracts.length === 0 && (
            <p className="text-sm text-slate-400">No sessions yet.</p>
          )}
          {contracts.map((s) => (
            <Link
              key={s.id}
              href={`/parent/sessions/${s.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--primary)]/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <p className="font-extrabold text-[var(--foreground)]">
                    {s.student.studentName} · {s.teacher.fullName}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${statusStyle(s.status)}`}
                  >
                    {s.status === "ACTIVE" ? "Active" : s.status === "PENDING_ESCROW" ? "Pending" : s.status.toLowerCase()}
                  </span>
                </div>
                <p className="text-sm text-[var(--secondary)]">
                  {new Date(s.startDate).toLocaleDateString()} ·{" "}
                  {s.status === "ACTIVE" ? "In progress" : s.status === "PENDING_ESCROW" ? "Awaiting payment" : s.status.toLowerCase()}
                </p>
              </div>
              <span className="text-sm font-bold text-[var(--primary)]">Open →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
