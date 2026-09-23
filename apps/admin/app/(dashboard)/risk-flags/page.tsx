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
      return "bg-red-50 text-red-600 dark:bg-red-950/40";
    case "MEDIUM":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40";
    case "LOW":
      return "bg-slate-100 text-slate-600 dark:bg-slate-800";
    case "CRITICAL":
      return "bg-red-100 text-red-800 dark:bg-red-900/40";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800";
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
        subtitle="Severity-ranked · {flags.length} open"
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
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-xl font-black text-[var(--foreground)]">{highCount}</p>
          <p className="text-xs text-[var(--secondary)]">High severity</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-xl font-black text-[var(--foreground)]">{mediumCount}</p>
          <p className="text-xs text-[var(--secondary)]">Medium severity</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-xl font-black text-[var(--foreground)]">{lowCount}</p>
          <p className="text-xs text-[var(--secondary)]">Low severity</p>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">Loading…</div>
        ) : flags.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--secondary)]">
            Queue empty — no open risk flags.
          </div>
        ) : (
          flags.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <p className="font-bold text-[var(--foreground)]">
                      {f.user?.fullName || f.userId}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${severityClass(f.severity)}`}
                    >
                      {severityLabel(f.severity)}
                    </span>
                    <span className="text-xs text-[var(--secondary)]">
                      {f.createdAt ? new Date(f.createdAt).toLocaleString() : ""}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {f.user?.role || "User"} · {f.reason}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Suspend and Warn are not yet available in the backend.
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
                    className="cursor-not-allowed rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-bold disabled:opacity-40"
                  >
                    Warn
                  </button>
                  <button
                    type="button"
                    onClick={() => clearFlag(f.id)}
                    disabled={clearingId === f.id}
                    className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-bold text-[var(--primary)] disabled:opacity-50"
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
