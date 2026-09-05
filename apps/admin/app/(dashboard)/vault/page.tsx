import Link from "next/link";
import PageHeader from "@/components/PageHeader";

const CASES = [
  {
    id: "v1",
    name: "Selamawit Tadesse",
    docs: [
      { type: "Fayda ID", state: "Verified" },
      { type: "Degree", state: "Verified" },
      { type: "Liveness", state: "Verified" },
    ],
    lastAccess: "11:42:03",
    by: "admin@tbb.et",
    risk: "low",
  },
  {
    id: "v2",
    name: "Bereket Solomon",
    docs: [
      { type: "Fayda ID", state: "Verified" },
      { type: "Degree", state: "Pending" },
    ],
    lastAccess: "10:15:22",
    by: "admin@tbb.et",
    risk: "medium",
  },
  {
    id: "v3",
    name: "Tadesse Alemu",
    docs: [
      { type: "Fayda ID", state: "Verified" },
      { type: "Degree", state: "Verified" },
      { type: "Police", state: "Pending" },
      { type: "Liveness", state: "Verified" },
    ],
    lastAccess: "09:01:11",
    by: "system",
    risk: "high",
  },
];

const ACCESS_LOG = [
  { time: "11:42:03", admin: "admin@tbb.et", target: "Tadesse Alemu · Fayda ID", hash: "a3f8c2…" },
  { time: "10:15:22", admin: "admin@tbb.et", target: "Bereket Solomon · Degree", hash: "b7d1e9…" },
  { time: "09:01:11", admin: "system", target: "Integrity scan · vault_documents", hash: "c2a4f7…" },
];

export default function VaultPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Vault"
        subtitle="Encrypted credentials · Admin-only · Every open is audit-logged"
      />

      <div className="rounded-2xl border-2 border-red-300 bg-white p-4 dark:border-red-800 dark:bg-[#112240]">
        <p className="text-xs font-bold text-red-700 dark:text-red-400">
          🔐 AES-256 private vault · Raw Fayda / degree / selfie never shown on public profiles
        </p>
        <p className="mt-1 text-[11px] text-red-600/80 dark:text-red-500">
          Access is restricted to authorized verification officers. Opens write to admin_audit_logs
          (HMAC chain).
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {CASES.map((row) => (
          <div
            key={row.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{row.name}</p>
                <p className="text-[11px] text-slate-500">
                  Last access {row.lastAccess} · {row.by}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  row.risk === "high"
                    ? "bg-red-50 text-red-700 dark:bg-red-900/30"
                    : row.risk === "medium"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30"
                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30"
                }`}
              >
                {row.risk} risk
              </span>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-2">
              {row.docs.map((d) => (
                <div
                  key={d.type}
                  className={`rounded-xl border-2 p-2 text-center ${
                    d.state === "Verified"
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                      : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
                  }`}
                >
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{d.type}</p>
                  <p
                    className={`text-[10px] font-semibold ${
                      d.state === "Verified" ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {d.state === "Verified" ? "✓ " : "⏳ "}
                    {d.state}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href={`/verification/${row.id}`}
              className="block rounded-xl bg-slate-900 py-2.5 text-center text-xs font-bold text-white dark:bg-teal-600"
            >
              Open vault case
            </Link>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
        <h3 className="mb-3 font-bold text-slate-900 dark:text-white">Vault access log</h3>
        <div className="space-y-2 font-mono text-[11px]">
          {ACCESS_LOG.map((log) => (
            <div
              key={log.hash + log.time}
              className="flex flex-wrap gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50"
            >
              <span className="text-slate-400">{log.hash}</span>
              <span className="text-teal-600">[{log.time}]</span>
              <span className="text-blue-600 dark:text-blue-400">{log.admin}</span>
              <span className="text-slate-600 dark:text-slate-400">{log.target}</span>
            </div>
          ))}
        </div>
        <Link href="/audit-logs" className="mt-4 inline-block text-sm font-bold text-teal-600">
          Full immutable ledger →
        </Link>
      </div>
    </div>
  );
}