"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminAuditLog } from "@/lib/adminApi";

type Severity = "info" | "warning" | "critical";

function getSeverity(actionType?: string): Severity {
  if (!actionType) return "info";
  const a = actionType.toUpperCase();
  if (a.includes("REJECT") || a.includes("SUSPEND") || a.includes("RISK") || a.includes("DELETE")) {
    return "critical";
  }
  if (a.includes("APPROVE") || a.includes("RELEASE") || a.includes("PAYOUT") || a.includes("VAULT")) {
    return "warning";
  }
  return "info";
}

function severityRowClass(severity: Severity) {
  switch (severity) {
    case "critical":
      return "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20";
    case "warning":
      return "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20";
    case "info":
    default:
      return "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50";
  }
}

function severityChip(severity: Severity) {
  switch (severity) {
    case "critical":
      return "bg-red-600 text-white";
    case "warning":
      return "bg-amber-500 text-white";
    case "info":
    default:
      return "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
  }
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.auditLogs(50);
      if (!cancelled) setLogs(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load audit logs");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Immutable Audit Log"
        subtitle="HMAC-SHA256 chained ledger · admin_audit_logs · append-only"
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]">
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white dark:bg-teal-600 dark:text-white">
          Tamper-Proof
        </span>
        <p className="text-xs text-slate-500">
          Each row stores <span className="font-mono text-teal-600">previous_hash</span> +{" "}
          <span className="font-mono text-teal-600">current_hash</span>. Tampering breaks the chain.
        </p>
      </div>

      <div className="space-y-2 font-mono text-[11px]">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">
            Loading…
          </div>
        ) : logs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">
            No audit logs found.
          </div>
        ) : (
          logs.map((log) => {
            const severity = getSeverity(log.actionType);
            return (
              <div
                key={log.id}
                className={`rounded-xl border px-4 py-3 ${severityRowClass(severity)}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400">#{String(log.id).slice(0, 6)}</span>
                  <span className="text-teal-600 dark:text-teal-400">
                    [{log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : "—"}]
                  </span>
                  {severity === "critical" && (
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${severityChip(severity)}`}>
                      CRITICAL
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  <span className="text-blue-600 dark:text-blue-400">
                    {log.adminId?.slice(0, 8) || "system"}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">{log.actionType.replace(/_/g, " ")}</span>
                  {log.reason && <span className="text-slate-500">{log.reason}</span>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
