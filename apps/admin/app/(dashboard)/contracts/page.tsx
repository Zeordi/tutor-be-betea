import PageHeader from "@/components/PageHeader";

const ROWS = [
  {
    id: "#4801",
    parent: "Yeshi Haile",
    tutor: "Selamawit Tadesse",
    amount: "5,400 ETB",
    milestone: "2/4",
    status: "Released",
    rail: "Telebirr",
  },
  {
    id: "#4798",
    parent: "Abebe Girma",
    tutor: "Bereket Solomon",
    amount: "5,400 ETB",
    milestone: "1/4",
    status: "In Escrow",
    rail: "CBE Birr",
  },
  {
    id: "#4791",
    parent: "Hiwot Teklu",
    tutor: "Tigist Haile",
    amount: "3,200 ETB",
    milestone: "2/3",
    status: "Disputed",
    rail: "Telebirr",
  },
  {
    id: "#4788",
    parent: "Yeshi Haile",
    tutor: "Selamawit Tadesse",
    amount: "2,000 ETB",
    milestone: "0/2",
    status: "Funded",
    rail: "Card",
  },
];

function statusStyle(status: string) {
  switch (status) {
    case "Released":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "In Escrow":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    case "Disputed":
      return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    case "Funded":
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800";
  }
}

export default function EscrowMonitoringPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Escrow Monitoring"
        subtitle="Funds held until verified attendance / parent confirmation"
      />

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Held balance", "2.4M ETB", "💰"],
          ["Active contracts", "1,842", "📄"],
          ["Pending release", "128", "⏳"],
          ["Disputes open", "17", "⚠️"],
        ].map(([l, v, i]) => (
          <div
            key={l}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]"
          >
            <p className="text-2xl">{i}</p>
            <p className="mt-2 text-2xl font-extrabold text-teal-600">{v}</p>
            <p className="text-xs text-slate-500">{l}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          "💰 Funded",
          "🔒 In Escrow",
          "✅ Released",
          "⚠️ Disputed",
          "⏳ Pending release",
        ].map((p) => (
          <span
            key={p}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {p}
          </span>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#112240]">
        <div className="grid grid-cols-12 gap-2 border-b border-slate-100 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:border-slate-800">
          <div className="col-span-2">Contract</div>
          <div className="col-span-2">Parent</div>
          <div className="col-span-2">Tutor</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-1">M/S</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Rail</div>
        </div>
        {ROWS.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-12 items-center gap-2 border-b border-slate-50 px-4 py-3 text-sm last:border-0 dark:border-slate-800/60"
          >
            <div className="col-span-2 font-bold text-slate-800 dark:text-white">{r.id}</div>
            <div className="col-span-2 text-slate-600 dark:text-slate-300">{r.parent}</div>
            <div className="col-span-2 text-slate-600 dark:text-slate-300">{r.tutor}</div>
            <div className="col-span-2 font-bold text-slate-900 dark:text-white">{r.amount}</div>
            <div className="col-span-1 text-xs text-slate-500">{r.milestone}</div>
            <div className="col-span-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusStyle(r.status)}`}>
                {r.status}
              </span>
            </div>
            <div className="col-span-1 text-[11px] font-semibold text-slate-500">{r.rail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}