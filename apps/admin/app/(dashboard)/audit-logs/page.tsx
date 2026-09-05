import PageHeader from "@/components/PageHeader";

const LOGS = [
  {
    hash: "a3f8c2…",
    prev: "99e1b0…",
    time: "11:42:03",
    user: "admin@tbb.et",
    action: "VAULT_ACCESS · Tadesse Alemu · Fayda ID",
    level: "high",
    ip: "196.188.x.x",
  },
  {
    hash: "b7d1e9…",
    prev: "a3f8c2…",
    time: "11:38:21",
    user: "system",
    action: "ESCROW_RELEASE · Contract #4801 · 2,700 ETB",
    level: "normal",
    ip: "—",
  },
  {
    hash: "c2a4f7…",
    prev: "b7d1e9…",
    time: "11:25:44",
    user: "admin@tbb.et",
    action: "VERIFICATION_APPROVE · Selamawit Tadesse",
    level: "high",
    ip: "196.188.x.x",
  },
  {
    hash: "d9e3b1…",
    prev: "c2a4f7…",
    time: "11:20:17",
    user: "system",
    action: "CHAT_REDACT · Session #9821 · Phone detected",
    level: "normal",
    ip: "—",
  },
  {
    hash: "e6c8a2…",
    prev: "d9e3b1…",
    time: "10:58:30",
    user: "admin@tbb.et",
    action: "USER_SUSPEND · Fraud attempt · User #8821",
    level: "critical",
    ip: "196.188.x.x",
  },
];

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Immutable Audit Log"
        subtitle="HMAC-SHA256 chained ledger · admin_audit_logs · append-only"
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]">
        <p className="text-xs text-slate-500">
          Each row stores <span className="font-mono text-teal-600">previous_hash</span> +{" "}
          <span className="font-mono text-teal-600">current_hash</span>. Tampering breaks the chain.
          Critical actions (vault, suspend, approve) are highlighted.
        </p>
      </div>

      <div className="space-y-2 font-mono text-[11px]">
        {LOGS.map((log) => (
          <div
            key={log.hash + log.time}
            className={`rounded-xl border px-3 py-3 ${
              log.level === "critical"
                ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20"
                : log.level === "high"
                  ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20"
                  : "border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400">curr:{log.hash}</span>
              <span className="text-slate-400">prev:{log.prev}</span>
              <span className="text-teal-600">[{log.time}]</span>
              {log.level === "critical" && (
                <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  CRITICAL
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              <span className="text-blue-600 dark:text-blue-400">{log.user}</span>
              <span className="text-slate-600 dark:text-slate-400">{log.action}</span>
              <span className="text-slate-400">ip:{log.ip}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}