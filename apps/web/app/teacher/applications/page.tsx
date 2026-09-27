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
  SUBMITTED: { label: "Submitted", color: "#0d9488", emoji: "📋" },
  REVIEWING: { label: "Reviewing", color: "#f59e0b", emoji: "🔍" },
  HIRED: { label: "Hired", color: "#14b8a6", emoji: "🎉" },
  DECLINED: { label: "Declined", color: "#ef4444", emoji: "✗" },
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

    return () => { cancelled = true; };
  }, []);

  const cols = ["SUBMITTED", "REVIEWING", "HIRED", "DECLINED"] as const;
  const counts = cols.map((s) => applications.filter((a) => a.status === s).length);

  const appsByStatus = (s: string) => applications.filter((a) => a.status === s);

  if (loading) {
    return (
      <div className="space-y-5 p-4 md:p-8">
        <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 w-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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
    <div className="space-y-5 p-4 md:p-8">
      <h1 className="text-xl font-extrabold text-slate-800 dark:text-white">My Applications</h1>

      <div className="flex flex-wrap items-center gap-3">
        {cols.map((s, i) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <div
              key={s}
              className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-[#112240]"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: cfg.color }}
              />
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white">{counts[i]}</p>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{cfg.label}</p>
              </div>
            </div>
          );
        })}

        <div className="ml-auto flex overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          {(["kanban", "table"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setMode(v)}
              className={`px-4 py-2 text-xs font-bold capitalize ${
                mode === v
                  ? "bg-[var(--primary)] text-white"
                  : "bg-white text-[var(--secondary)] dark:bg-[#112240]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-[#112240]">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No applications yet</p>
          <p className="mt-1 text-xs text-slate-400">Apply to jobs to track them here.</p>
        </div>
      ) : mode === "kanban" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cols.map((status) => {
            const cfg = STATUS_CONFIG[status];
            const colApps = appsByStatus(status);
            return (
              <div key={status} className="min-w-0">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: cfg.color }}
                  />
                  <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                    {cfg.label}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: `${cfg.color}18`, color: cfg.color }}
                  >
                    {colApps.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {colApps.map((a) => (
                    <div
                      key={a.id}
                      className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#112240]"
                    >
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{a.job.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {a.job.family} · {a.job.loc}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          {new Date(a.appliedAt).toLocaleDateString()}
                        </span>
                        <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                          {a.job.rate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-[#112240]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {["Title", "Family", "Status", "Rate", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => {
                const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.SUBMITTED;
                return (
                  <tr key={a.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-white">{a.job.title}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{a.job.family} · {a.job.loc}</td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ background: `${cfg.color}18`, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-teal-600 dark:text-teal-400">{a.job.rate}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
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
