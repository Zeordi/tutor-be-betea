"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminAuditLog } from "@/lib/adminApi";

function levelClass(actionType?: string) {
  if (!actionType) return "border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50";
  const a = actionType.toUpperCase();
  if (a.includes("REJECT") || a.includes("SUSPEND") || a.includes("RISK") || a.includes("DELETE")) {
    return "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20";
  }
  if (a.includes("APPROVE") || a.includes("RELEASE") || a.includes("PAYOUT")) {
    return "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20";
  }
  return "border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50";
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

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]">
        <p className="text-xs text-slate-500">
          Each row stores <span className="font-mono text-teal-600">previous_hash</span> +{" "}
          <span className="font-mono text-teal-600">current_hash</span>. Tampering breaks the chain.
          Critical actions (vault, suspend, approve) are highlighted.
        </p>
      </div>

      <div className="space-y-2 font-mono text-[11px]">
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">Loading…</div>
        ) : logs.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">No audit logs found.</div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`rounded-xl border px-3 py-3 ${levelClass(log.actionType)}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400">curr:{String(log.id).slice(0, 6)}</span>
                <span className="text-teal-600">[{log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : "—"}]</span>
                {log.actionType?.toUpperCase().includes("REJECT") ||
                log.actionType?.toUpperCase().includes("SUSPEND") ||
                log.actionType?.toUpperCase().includes("RISK") ? (
                  <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white">CRITICAL</span>
                ) : null}
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className="text-blue-600 dark:text-blue-400">{log.adminId}</span>
                <span className="text-slate-600 dark:text-slate-400">{log.actionType}</span>
                {log.reason && <span className="text-slate-400">{log.reason}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
