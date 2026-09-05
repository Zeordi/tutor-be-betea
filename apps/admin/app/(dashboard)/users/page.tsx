import Link from "next/link";
import PageHeader from "@/components/PageHeader";

const USERS = [
  {
    id: "u1",
    name: "Yeshi Haile",
    role: "PARENT",
    status: "ACTIVE",
    city: "Bole",
    phone: "+251 91 *** 2201",
    joined: "Jan 2026",
  },
  {
    id: "u2",
    name: "Selamawit Tadesse",
    role: "TEACHER",
    status: "ACTIVE",
    city: "Kazanchis",
    phone: "+251 91 *** 4521",
    joined: "Dec 2025",
  },
  {
    id: "u3",
    name: "Abebe Girma",
    role: "PARENT",
    status: "ACTIVE",
    city: "Arat Kilo",
    phone: "+251 92 *** 1188",
    joined: "Feb 2026",
  },
  {
    id: "u4",
    name: "Bereket Solomon",
    role: "TEACHER",
    status: "PENDING_VERIFICATION",
    city: "Bole",
    phone: "+251 93 *** 8810",
    joined: "Mar 2026",
  },
  {
    id: "u5",
    name: "Fraud Attempt #8821",
    role: "TEACHER",
    status: "SUSPENDED",
    city: "—",
    phone: "+251 90 *** 0000",
    joined: "Mar 2026",
  },
];

function statusClass(status: string) {
  if (status === "ACTIVE")
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (status === "SUSPENDED" || status === "BANNED")
    return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
  return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
}

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Parents, tutors, and account status · Super Admin"
        action={
          <div className="flex gap-2 text-xs font-bold">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {USERS.length} shown
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-900/30">
              {USERS.filter((u) => u.status === "ACTIVE").length} active
            </span>
          </div>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#112240]">
        <div className="grid grid-cols-12 gap-2 border-b border-slate-100 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:border-slate-800">
          <div className="col-span-3">User</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">City</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Joined</div>
          <div className="col-span-1">View</div>
        </div>
        {USERS.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-12 items-center gap-2 border-b border-slate-50 px-4 py-3 last:border-0 dark:border-slate-800/60"
          >
            <div className="col-span-3">
              <p className="text-sm font-bold text-slate-800 dark:text-white">{u.name}</p>
              <p className="text-xs text-slate-400">{u.phone}</p>
            </div>
            <div className="col-span-2">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {u.role}
              </span>
            </div>
            <div className="col-span-2 text-xs text-slate-500">{u.city}</div>
            <div className="col-span-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClass(u.status)}`}>
                {u.status}
              </span>
            </div>
            <div className="col-span-2 text-xs text-slate-500">{u.joined}</div>
            <div className="col-span-1">
              <Link
                href={`/users/${u.id}`}
                className="text-xs font-bold text-teal-600 hover:underline"
              >
                Open
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}