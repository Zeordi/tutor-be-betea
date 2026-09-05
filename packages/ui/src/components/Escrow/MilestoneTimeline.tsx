import React from "react";

export interface Milestone {
  id: string;
  label: string;
  amount?: string;
  status: "done" | "current" | "upcoming";
  date?: string;
}

export interface MilestoneTimelineProps {
  milestones: Milestone[];
  className?: string;
}

/** A8 · Escrow Milestone Timeline */
export function MilestoneTimeline({ milestones, className = "" }: MilestoneTimelineProps) {
  return (
    <div className={`space-y-0 ${className}`}>
      {milestones.map((m, i) => {
        const isLast = i === milestones.length - 1;
        const dot =
          m.status === "done"
            ? "bg-emerald-500"
            : m.status === "current"
              ? "bg-amber-500 ring-4 ring-amber-500/20"
              : "bg-slate-300 dark:bg-slate-600";
        const line =
          m.status === "done" ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700";

        return (
          <div key={m.id} className="relative flex gap-3 pb-4 last:pb-0">
            {!isLast && (
              <div className={`absolute left-[7px] top-5 bottom-0 w-0.5 ${line}`} />
            )}
            <div className={`relative z-10 mt-1 h-4 w-4 flex-shrink-0 rounded-full ${dot}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`text-xs font-bold ${
                    m.status === "upcoming"
                      ? "text-slate-400"
                      : "text-slate-800 dark:text-white"
                  }`}
                >
                  {m.label}
                </p>
                {m.amount && (
                  <span className="text-xs font-extrabold text-teal-600">{m.amount}</span>
                )}
              </div>
              {m.date && <p className="text-[10px] text-slate-400">{m.date}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MilestoneTimeline;