import PageHeader from "@/components/PageHeader";

const LOGS = [
  { hash: "a3f8c2…", time: "11:42:03", user: "admin@tbb.et", action: "VAULT_ACCESS · Tadesse Alemu · Fayda ID", level: "high" },
  { hash: "b7d1e9…", time: "11:38:21", user: "system", action: "ESCROW_RELEASE · Contract #4801 · 2,700 ETB", level: "normal" },
  { hash: "c2a4f7…", time: "11:25:44", user: "admin@tbb.et", action: "VERIFICATION_APPROVE · Selamawit Tadesse", level: "high" },
  { hash: "d9e3b1…", time: "11:20:17", user: "system", action: "CHAT_REDACT · Session #9821 · Phone detected", level: "normal" },
  { hash: "e6c8a2…", time: "10:58:30", user: "admin@tbb.et", action: "USER_SUSPEND · Fraud attempt · User #8821", level: "critical" },
];

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Immutable Audit Log"
        subtitle="HMAC-SHA256 chained ledger · admin_audit_logs"
      />
      <div className="space-y-2 font-mono text-[11px]">
        {LOGS.map((log) => (
          <div
            key={log.hash + log.time}
            className={`flex flex-wrap items-start gap-2 rounded-lg px-3 py-2 ${
              log.level === "critical"
                ? "bg-red-50 dark:bg-red-900/20"
                : log.level === "high"
                  ? "bg-amber-50 dark:bg-amber-900/20"
                  : "bg-slate-50 dark:bg-slate-800/50"
            }`}
          >
            <span className="shrink-0 text-slate-400">{log.hash}</span>
            <span className="shrink-0 text-teal-600">[{log.time}]</span>
            <span className="shrink-0 text-blue-600 dark:text-blue-400">{log.user}</span>
            <span className="text-slate-600 dark:text-slate-400">{log.action}</span>
            {log.level === "critical" && (
              <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                CRITICAL
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}