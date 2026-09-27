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

function statusPill(status: Contract["status"]) {
  if (status === "ACTIVE")
    return "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300";
  if (status === "COMPLETED")
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (status === "PAUSED")
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300";
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
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

    return () => { cancelled = true; };
  }, []);

  const activeCount = contracts.filter((c) => c.status === "ACTIVE").length;
  const totalEscrow = contracts
    .filter((c) => c.status === "ACTIVE")
    .reduce((sum, c) => sum + (c.escrowHeld || 0), 0);
  const completedCount = contracts.filter((c) => c.status === "COMPLETED").length;

  if (loading) {
    return (
      <div className="space-y-5 p-4 md:p-8">
        <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 w-36 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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
    <div className="space-y-5 p-4 md:p-8">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-white">Active Contracts</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Escrow-backed agreements · funds release after verified sessions
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          [String(activeCount), "Active"],
          [`${totalEscrow.toLocaleString()} ETB`, "In escrow"],
          [String(completedCount), "Completed"],
        ].map(([v, l]) => (
          <div
            key={l}
            className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-[#112240]"
          >
            <div>
              <p className="text-xl font-black text-teal-600">{v}</p>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{l}</p>
            </div>
          </div>
        ))}
      </div>

      {contracts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-[#112240]">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No contracts yet</p>
          <p className="mt-1 text-xs text-slate-400">Active agreements will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((c) => {
            const pct = c.sessionsTotal > 0 ? Math.round((c.sessionsDone / c.sessionsTotal) * 100) : 0;
            return (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-[#112240]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white">{c.family}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {c.child} · {c.subject}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${statusPill(c.status)}`}>
                    {c.status}
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-1">
                  {MILESTONES.map((m, i) => {
                    const done = i <= c.milestoneIndex;
                    return (
                      <div key={m} className="flex flex-1 flex-col items-center gap-1">
                        <div className="flex w-full items-center">
                          {i > 0 && (
                            <div
                              className={`h-0.5 flex-1 ${
                                i <= c.milestoneIndex ? "bg-teal-500" : "bg-slate-200 dark:bg-slate-700"
                              }`}
                            />
                          )}
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                              done
                                ? "bg-teal-600 text-white"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {done ? "✓" : i + 1}
                          </div>
                          {i < MILESTONES.length - 1 && (
                            <div
                              className={`h-0.5 flex-1 ${
                                i < c.milestoneIndex
                                  ? "bg-teal-500"
                                  : "bg-slate-200 dark:bg-slate-700"
                              }`}
                            />
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{m}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Rate</p>
                    <p className="font-mono font-bold text-teal-600 dark:text-teal-400">{c.rate}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Escrow held</p>
                    <p className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {(c.escrowHeld || 0).toLocaleString()} ETB
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Next session</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {c.nextSession ? new Date(c.nextSession).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>Sessions {c.sessionsDone}/{c.sessionsTotal}</span>
                  <span>{pct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-teal-600"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href={`/teacher/sessions/${c.id}`}
                    className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700"
                  >
                    Open session
                  </Link>
                  <Link
                    href="/teacher/chat"
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Message parent
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
