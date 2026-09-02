export default function TeacherAnalyticsPage() {
  return (
    <div className="space-y-5 p-6">
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Analytics & Insights</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Profile Views", "247", "This month"],
          ["Job Matches", "18", "Active"],
          ["Apply Rate", "67%", "Applied/matched"],
          ["Rehire Rate", "94%", "Past clients"],
        ].map(([l, v, s]) => (
          <div
            key={l}
            className="rounded-2xl border border-slate-100 bg-white p-4 text-center dark:border-slate-800 dark:bg-[#112240]"
          >
            <p className="text-2xl font-extrabold text-teal-600">{v}</p>
            <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">{l}</p>
            <p className="text-[10px] text-slate-400">{s}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">Subject Demand</h3>
          <div className="space-y-3">
            {[
              ["Mathematics", "85%"],
              ["Physics", "72%"],
              ["Statistics", "58%"],
              ["Chemistry", "45%"],
            ].map(([sub, pct]) => (
              <div key={sub}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{sub}</span>
                  <span className="font-bold text-teal-600">{pct}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400"
                    style={{ width: pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">Earnings Forecast</h3>
          <div className="space-y-2">
            {[
              ["Next Month (projected)", "14,200 ETB"],
              ["If +2 sessions/week", "17,600 ETB"],
              ["Annual (current rate)", "153,600 ETB"],
            ].map(([label, val]) => (
              <div
                key={label}
                className="flex justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
              >
                <span className="text-xs text-slate-600 dark:text-slate-400">{label}</span>
                <span className="text-xs font-extrabold text-teal-600">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}