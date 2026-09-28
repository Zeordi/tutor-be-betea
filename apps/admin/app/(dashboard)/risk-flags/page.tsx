"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminRiskFlag } from "@/lib/adminApi";

function severityLabel(severity: string): string {
  switch (severity) {
    case "HIGH":
      return "High";
    case "MEDIUM":
      return "Medium";
    case "LOW":
      return "Low";
    case "CRITICAL":
      return "Critical";
    default:
      return severity;
  }
}

function severityClass(severity: string) {
  switch (severity) {
    case "HIGH":
      return "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300";
    case "MEDIUM":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
    case "LOW":
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
    case "CRITICAL":
      return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }
}

export default function RiskFlagsPage() {
  const [flags, setFlags] = useState<AdminRiskFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clearingId, setClearingId] = useState<string | null>(null);

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.riskFlags();
      if (!cancelled) setFlags(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load risk flags");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const clearFlag = async (id: string) => {
    setClearingId(id);
    try {
      await adminApi.clearRiskFlag(id);
      setFlags((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to clear flag");
    } finally {
      setClearingId(null);
    }
  };

  const highCount = flags.filter((f) => f.severity === "HIGH" || f.severity === "CRITICAL").length;
  const mediumCount = flags.filter((f) => f.severity === "MEDIUM").length;
  const lowCount = flags.filter((f) => f.severity === "LOW").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Flagging Queue"
        subtitle="Severity-ranked · review before action"
        action={
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {flags.length} open
          </span>
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-xl font-black text-red-600 dark:text-red-400">{highCount}</p>
          <p className="mt-2 text-xs text-slate-500">High / Critical severity</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-xl font-black text-amber-600 dark:text-amber-400">{mediumCount}</p>
          <p className="mt-2 text-xs text-slate-500">Medium severity</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-xl font-black text-slate-700 dark:text-slate-200">{lowCount}</p>
          <p className="mt-2 text-xs text-slate-500">Low severity</p>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">Loading…</div>
        ) : flags.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-[#112240]">
            Queue empty — no open risk flags.
          </div>
        ) : (
          flags.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {f.user?.fullName || f.userId}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${severityClass(f.severity)}`}
                    >
                      {severityLabel(f.severity)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {f.createdAt ? new Date(f.createdAt).toLocaleString() : ""}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {f.user?.role || "User"} · {f.reason}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled
                    title="No backend endpoint for suspend"
                    className="cursor-not-allowed rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
                  >
                    Suspend
                  </button>
                  <button
                    type="button"
                    disabled
                    title="No backend endpoint for warn"
                    className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-400 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800"
                  >
                    Warn
                  </button>
                  <button
                    type="button"
                    onClick={() => clearFlag(f.id)}
                    disabled={clearingId === f.id}
                    className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 disabled:opacity-50 dark:border-teal-800 dark:bg-teal-950/30 dark:text-teal-300"
                  >
                    {clearingId === f.id ? "…" : "Clear"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
