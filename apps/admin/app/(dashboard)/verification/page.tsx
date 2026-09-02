import Link from "next/link";
import PageHeader from "@/components/PageHeader";

const QUEUE = [
  {
    id: "v1",
    name: "Selamawit Tadesse",
    phone: "+251 91 *** 4521",
    docs: ["Fayda ID", "Degree", "Selfie"],
    submitted: "2h ago",
    priority: "High",
    status: "PENDING",
  },
  {
    id: "v2",
    name: "Bereket Solomon",
    phone: "+251 93 *** 8810",
    docs: ["Police Clearance"],
    submitted: "5h ago",
    priority: "Normal",
    status: "PENDING",
  },
  {
    id: "v3",
    name: "Tigist Haile",
    phone: "+251 92 *** 1102",
    docs: ["Fayda ID", "Degree"],
    submitted: "1d ago",
    priority: "High",
    status: "UNDER_REVIEW",
  },
  {
    id: "v4",
    name: "Dawit Kebede",
    phone: "+251 91 *** 7744",
    docs: ["Degree"],
    submitted: "2d ago",
    priority: "Normal",
    status: "PENDING",
  },
];

export default function VerificationQueuePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification Queue"
        subtitle="Review tutor credentials before Trust Badges are issued"
        action={
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            {QUEUE.length} pending
          </span>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#112240]">
        <div className="grid grid-cols-12 gap-2 border-b border-slate-100 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:border-slate-800">
          <div className="col-span-3">Tutor</div>
          <div className="col-span-3">Documents</div>
          <div className="col-span-2">Submitted</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Action</div>
        </div>
        {QUEUE.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-12 items-center gap-2 border-b border-slate-50 px-4 py-3 last:border-0 dark:border-slate-800/60"
          >
            <div className="col-span-3">
              <p className="text-sm font-bold text-slate-800 dark:text-white">{row.name}</p>
              <p className="text-xs text-slate-400">{row.phone}</p>
            </div>
            <div className="col-span-3 flex flex-wrap gap-1">
              {row.docs.map((d) => (
                <span
                  key={d}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {d}
                </span>
              ))}
            </div>
            <div className="col-span-2 text-xs text-slate-500">{row.submitted}</div>
            <div className="col-span-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  row.priority === "High"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {row.priority}
              </span>
            </div>
            <div className="col-span-2">
              <Link
                href={`/verification/${row.id}`}
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700"
              >
                Review
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}