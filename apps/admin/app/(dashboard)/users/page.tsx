import PageHeader from "@/components/PageHeader";

const USERS = [
  { name: "Yeshi Haile", role: "PARENT", status: "ACTIVE", city: "Bole" },
  { name: "Selamawit Tadesse", role: "TEACHER", status: "ACTIVE", city: "Kazanchis" },
  { name: "Abebe Girma", role: "PARENT", status: "ACTIVE", city: "Arat Kilo" },
  { name: "Fraud Attempt #8821", role: "TEACHER", status: "SUSPENDED", city: "—" },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Users" subtitle="Parents, tutors, and account status" />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#112240]">
        {USERS.map((u) => (
          <div
            key={u.name}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-50 px-4 py-3 last:border-0 dark:border-slate-800/60"
          >
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{u.name}</p>
              <p className="text-xs text-slate-500">
                {u.role} · {u.city}
              </p>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                u.status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30"
                  : "bg-red-50 text-red-700 dark:bg-red-900/30"
              }`}
            >
              {u.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}