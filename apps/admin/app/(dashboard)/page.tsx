import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

const KPIS = [
  { label: "Total Users", value: "52,841", delta: "+12%", icon: "👥", tone: "teal" as const },
  { label: "Active Tutors", value: "12,847", delta: "+8%", icon: "🧑‍🏫", tone: "blue" as const },
  { label: "Sessions Today", value: "3,421", delta: "+18%", icon: "📅", tone: "purple" as const },
  { label: "Escrow Balance", value: "2.4M ETB", delta: "+22%", icon: "💰", tone: "amber" as const },
  { label: "Pending Verif.", value: "234", delta: "-5%", icon: "⏳", tone: "orange" as const },
  { label: "Connects Sold", value: "18,400", delta: "+31%", icon: "🔗", tone: "emerald" as const },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        subtitle="Live platform health across users, escrow, and verification"
        action={
          <Link
            href="/verification"
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"
          >
            Review Queue →
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {KPIS.map((k) => (
          <StatCard key={k.label} {...k} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Verification Queue Snapshot</h3>
          <div className="space-y-3">
            {[
              ["Selamawit Tadesse", "Degree + Fayda", "High"],
              ["Bereket Solomon", "Police Clearance", "Normal"],
              ["Tigist Haile", "National ID", "High"],
            ].map(([name, docs, priority]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{name}</p>
                  <p className="text-xs text-slate-500">{docs}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    priority === "High"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {priority}
                </span>
              </div>
            ))}
          </div>
          <Link href="/verification" className="mt-4 inline-block text-sm font-bold text-teal-600">
            Open full queue →
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Recent Audit Events</h3>
          <div className="space-y-2 font-mono text-[11px]">
            {[
              { hash: "a3f8c2…", user: "admin@tbb.et", action: "VAULT_ACCESS · Fayda ID", level: "high" },
              { hash: "b7d1e9…", user: "system", action: "ESCROW_RELEASE · 2,700 ETB", level: "normal" },
              { hash: "c2a4f7…", user: "admin@tbb.et", action: "VERIFICATION_APPROVE", level: "high" },
              { hash: "e6c8a2…", user: "admin@tbb.et", action: "USER_SUSPEND · Fraud", level: "critical" },
            ].map((log) => (
              <div
                key={log.hash}
                className={`flex flex-wrap gap-2 rounded-lg px-3 py-2 ${
                  log.level === "critical"
                    ? "bg-red-50 dark:bg-red-900/20"
                    : log.level === "high"
                      ? "bg-amber-50 dark:bg-amber-900/20"
                      : "bg-slate-50 dark:bg-slate-800/50"
                }`}
              >
                <span className="text-slate-400">{log.hash}</span>
                <span className="text-blue-600 dark:text-blue-400">{log.user}</span>
                <span className="text-slate-600 dark:text-slate-400">{log.action}</span>
              </div>
            ))}
          </div>
          <Link href="/audit-logs" className="mt-4 inline-block text-sm font-bold text-teal-600">
            View immutable ledger →
          </Link>
        </div>
      </div>
    </div>
  );
}