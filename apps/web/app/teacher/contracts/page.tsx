"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

const MILESTONES = ["Funded", "In Escrow", "Sessions", "Released"] as const;

type ApiContract = {
  id: string;
  status: string;
  agreedAmount: number;
  escrowHeldAmount: number;
  startDate: string;
  endDate: string;
  parent: { fullName: string } | null;
  student: { studentName: string; subjects: string[] } | null;
};

type Contract = {
  id: string;
  family: string;
  child: string;
  subject: string;
  rate: string;
  status: "ACTIVE" | "COMPLETED" | "PAUSED" | "INACTIVE";
  escrowHeld: number;
  sessionsDone: number;
  sessionsTotal: number;
  nextSession: string;
  milestoneIndex: number;
};

function toContract(data: ApiContract): Contract {
  const subject = data.student?.subjects?.[0] || "General";
  return {
    id: data.id,
    family: data.parent?.fullName || "Family",
    child: data.student?.studentName || "Child",
    subject,
    rate: `${Number(data.agreedAmount || 0).toLocaleString()} ETB`,
    status: data.status as Contract["status"],
    escrowHeld: Number(data.escrowHeldAmount || 0),
    sessionsDone: 0,
    sessionsTotal: 0,
    nextSession: data.startDate || "",
    milestoneIndex: data.status === "ACTIVE" ? 1 : data.status === "COMPLETED" ? 3 : 0,
  };
}

export default function TeacherContractsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<ApiContract[]>(paths.contractsTeacher)
      .then((data) => {
        if (!cancelled) setContracts((data || []).map(toContract));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load contracts");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeCount = contracts.filter((c) => c.status === "ACTIVE").length;
  const totalEscrow = contracts
    .filter((c) => c.status === "ACTIVE")
    .reduce((sum, c) => sum + (c.escrowHeld || 0), 0);
  const completedCount = contracts.filter((c) => c.status === "COMPLETED").length;

  if (loading) {
    return (
      <div>
        <div className="mb-6 h-8 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mb-6 h-4 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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
        <h1 className="text-2xl font-black text-[var(--foreground)]">Active Contracts</h1>
        <p className="text-sm text-[var(--secondary)]">
          Escrow-backed agreements · funds release after verified sessions
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          [String(activeCount), "Active"],
          [`${totalEscrow.toLocaleString()} ETB`, "In escrow"],
          [String(completedCount), "Completed"],
        ].map(([v, l]) => (
          <div
            key={l}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4"
          >
            <p className="text-xl font-black text-[var(--primary)]">{v}</p>
            <p className="text-xs text-[var(--secondary)]">{l}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {contracts.map((c) => {
          const pct = c.sessionsTotal > 0 ? Math.round((c.sessionsDone / c.sessionsTotal) * 100) : 0;
          return (
            <div
              key={c.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 md:p-6"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-extrabold text-[var(--foreground)]">{c.family}</p>
                  <p className="text-sm text-[var(--secondary)]">
                    {c.child} · {c.subject}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                    c.status === "ACTIVE"
                      ? "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40"
                      : "bg-[var(--muted)] text-[var(--secondary)]"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <div className="mb-5 flex items-center gap-1">
                {MILESTONES.map((m, i) => {
                  const done = i <= c.milestoneIndex;
                  return (
                    <div key={m} className="flex flex-1 flex-col items-center gap-1">
                      <div className="flex w-full items-center">
                        {i > 0 && (
                          <div
                            className={`h-0.5 flex-1 ${
                              i <= c.milestoneIndex
                                ? "bg-[var(--primary)]"
                                : "bg-[var(--border)]"
                            }`}
                          />
                        )}
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                            done
                              ? "bg-[var(--primary)] text-white"
                              : "bg-[var(--muted)] text-[var(--secondary)]"
                          }`}
                        >
                          {done ? "✓" : i + 1}
                        </div>
                        {i < MILESTONES.length - 1 && (
                          <div
                            className={`h-0.5 flex-1 ${
                              i < c.milestoneIndex
                                ? "bg-[var(--primary)]"
                                : "bg-[var(--border)]"
                            }`}
                          />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-[var(--secondary)]">{m}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-[var(--muted)] p-3">
                  <p className="text-[11px] text-[var(--secondary)]">Rate</p>
                  <p className="font-mono font-bold text-[var(--primary)]">{c.rate || c.escrowHeld + " ETB"}</p>
                </div>
                <div className="rounded-xl bg-[var(--muted)] p-3">
                  <p className="text-[11px] text-[var(--secondary)]">Escrow held</p>
                  <p className="font-mono font-bold text-[var(--foreground)]">
                    {(c.escrowHeld || 0).toLocaleString()} ETB
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--muted)] p-3">
                  <p className="text-[11px] text-[var(--secondary)]">Next session</p>
                  <p className="font-bold text-[var(--foreground)]">{c.nextSession || "—"}</p>
                </div>
              </div>

              <div className="mb-2 flex justify-between text-xs font-semibold text-[var(--secondary)]">
                <span>
                  Sessions {c.sessionsDone}/{c.sessionsTotal}
                </span>
                <span>{pct}%</span>
              </div>
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)]"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/teacher/sessions/${c.id}`}
                  className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
                >
                  Open session
                </Link>
                <Link
                  href="/teacher/chat"
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--foreground)]"
                >
                  Message parent
                </Link>
              </div>
            </div>
          );
        })}
        {contracts.length === 0 && (
          <p className="text-sm text-[var(--secondary)]">No contracts found.</p>
        )}
      </div>
    </div>
  );
}
