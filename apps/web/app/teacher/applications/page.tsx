"use client";

import { useEffect, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

type Application = {
  id: string;
  status: "SUBMITTED" | "REVIEWING" | "HIRED" | "DECLINED";
  job: {
    title: string;
    family: string;
    loc: string;
    rate: string;
  };
  appliedAt: string;
  coverNote: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  SUBMITTED: { label: "Submitted", color: "var(--primary)", emoji: "📋" },
  REVIEWING: { label: "Reviewing", color: "#F59E0B", emoji: "🔍" },
  HIRED: { label: "Hired", color: "#2DD4BF", emoji: "🎉" },
  DECLINED: { label: "Declined", color: "#EF4444", emoji: "✗" },
};

export default function TeacherApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [mode, setMode] = useState<"kanban" | "table">("kanban");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<Application[]>(paths.jobsApplicationsMine)
      .then((data) => {
        if (!cancelled) setApplications(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load applications");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const cols = ["SUBMITTED", "REVIEWING", "HIRED", "DECLINED"] as const;
  const counts = cols.map(
    (s) => applications.filter((a) => a.status === s).length,
  );

  const appsByStatus = (s: string) =>
    applications.filter((a) => a.status === s);

  if (loading) {
    return (
      <div>
        <div className="mb-6 h-8 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mb-6 grid gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          {cols.map((s, i) => (
            <div
              key={s}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
            >
              <p className="text-xl font-black text-[var(--primary)]">{counts[i]}</p>
              <p className="text-[11px] text-[var(--secondary)]">{STATUS_CONFIG[s]?.label}</p>
            </div>
          ))}
        </div>
        <div className="flex overflow-hidden rounded-lg border border-[var(--border)]">
          {(["kanban", "table"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setMode(v)}
              className={`px-4 py-2 text-xs font-bold capitalize ${
                mode === v
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--card)] text-[var(--secondary)]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {mode === "kanban" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cols.map((status) => {
            const cfg = STATUS_CONFIG[status];
            const colApps = appsByStatus(status);
            return (
              <div key={status}>
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: cfg.color }}
                  />
                  <span className="text-xs font-bold uppercase text-[var(--secondary)]">
                    {cfg.label}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                    style={{ background: `${cfg.color}18`, color: cfg.color }}
                  >
                    {colApps.length}
                  </span>
                </div>
                {colApps.map((a) => (
                  <div
                    key={a.id}
                    className="mb-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
                  >
                    <p className="font-bold text-[var(--foreground)]">{a.job.title}</p>
                    <p className="text-xs text-[var(--secondary)]">
                      {a.job.family} · {a.job.loc}
                    </p>
                    <div className="mt-2 flex justify-between text-xs">
                      <span className="text-[var(--secondary)]">
                        {new Date(a.appliedAt).toLocaleDateString()}
                      </span>
                      <span className="font-mono font-bold text-[var(--primary)]">
                        {a.job.rate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                {["Title", "Family", "Status", "Rate", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[11px] font-bold uppercase text-[var(--secondary)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                    No applications yet.
                  </td>
                </tr>
              )}
              {applications.map((a) => {
                const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.SUBMITTED;
                return (
                  <tr key={a.id} className="border-b border-[var(--border)]">
                    <td className="px-4 py-3 font-bold text-[var(--foreground)]">{a.job.title}</td>
                    <td className="px-4 py-3 text-[var(--secondary)]">{a.job.family} · {a.job.loc}</td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                        style={{ background: `${cfg.color}18`, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--primary)]">{a.job.rate}</td>
                    <td className="px-4 py-3 text-[var(--secondary)]">
                      {new Date(a.appliedAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
