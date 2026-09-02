import PageHeader from "@/components/PageHeader";

export default function TicketsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Support & Disputes" subtitle="Replacement requests, safety reports, escrow disputes" />
      <div className="space-y-3">
        {[
          ["Replacement · Contract #4801", "OPEN", "Parent requested new tutor"],
          ["Payment dispute · #4791", "UNDER_REVIEW", "Milestone contested"],
          ["Safety report · Session #9821", "OPEN", "Late check-in flagged"],
        ].map(([title, status, note]) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-slate-800 dark:text-white">{title}</p>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30">
                {status}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}