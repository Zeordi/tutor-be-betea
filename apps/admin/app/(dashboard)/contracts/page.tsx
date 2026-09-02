import PageHeader from "@/components/PageHeader";

export default function EscrowMonitoringPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Escrow Monitoring"
        subtitle="Funds held until verified attendance / parent confirmation"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Held balance", "2.4M ETB", "💰"],
          ["Active contracts", "1,842", "📄"],
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
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
        <p className="mb-3 text-sm font-bold text-slate-800 dark:text-white">Recent releases</p>
        {[
          ["Contract #4801", "2,700 ETB", "Released"],
          ["Contract #4798", "5,400 ETB", "Held"],
          ["Contract #4791", "3,200 ETB", "Disputed"],
        ].map(([id, amt, st]) => (
          <div
            key={id}
            className="flex items-center justify-between border-b border-slate-50 py-2 last:border-0 dark:border-slate-800"
          >
            <span className="text-sm text-slate-700 dark:text-slate-300">{id}</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{amt}</span>
            <span className="text-xs font-semibold text-slate-500">{st}</span>
          </div>
        ))}
      </div>
    </div>
  );
}