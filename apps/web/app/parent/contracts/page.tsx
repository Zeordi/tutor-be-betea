export default function ParentContractsPage() {
  return (
    <div className="space-y-5 p-6">
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Contracts & Escrow</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            tutor: "Selamawit Tadesse",
            subject: "Math · Gr. 10 · Kidane",
            milestones: [
              { label: "Month 1", status: "released", amount: 5400 },
              { label: "Month 2", status: "held", amount: 5400 },
              { label: "Month 3", status: "upcoming", amount: 5400 },
            ],
          },
          {
            tutor: "Tigist Haile",
            subject: "English · Gr. 8 · Meron",
            milestones: [
              { label: "Block 1", status: "released", amount: 3200 },
              { label: "Block 2", status: "disputed", amount: 3200 },
            ],
          },
        ].map((c) => (
          <div
            key={c.tutor}
            className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
                {c.tutor.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">{c.tutor}</p>
                <p className="text-xs text-slate-400">{c.subject}</p>
              </div>
            </div>
            <div className="mb-4 space-y-2">
              {c.milestones.map((m) => (
                <div key={m.label} className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                      m.status === "released"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                        : m.status === "held"
                          ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                          : m.status === "disputed"
                            ? "bg-red-100 text-red-500 dark:bg-red-900/30"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                    }`}
                  >
                    {m.status === "released" ? "✓" : m.status === "held" ? "🔒" : m.status === "disputed" ? "!" : "○"}
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{m.label}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">
                        {m.amount.toLocaleString()} ETB
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {m.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 rounded-xl bg-teal-600 py-2 text-xs font-bold text-white">
                Release Milestone
              </button>
              <button className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 dark:border-slate-700 dark:text-slate-400">
                Raise Dispute
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}