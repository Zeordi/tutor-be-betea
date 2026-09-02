export default function TeacherHomePage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="mb-1 text-xl font-extrabold text-slate-800 dark:text-white">
          Good morning 👋
        </h2>
        <p className="text-sm text-slate-500">
          You have 3 sessions today · 5 new job matches
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["This Month", "12,800 ETB", "💰"],
          ["Rating", "4.9 ⭐", "32 reviews"],
          ["Sessions", "32", "This month"],
          ["Connects", "24 left", "🔗 balance"],
        ].map(([label, val, sub]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]"
          >
            <p className="text-xl font-extrabold text-teal-600">{val}</p>
            <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">
              {label}
            </p>
            <p className="text-[10px] text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240] md:col-span-2">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">
            Today&apos;s Schedule
          </h3>
          <div className="space-y-3">
            {[
              ["Kidane M.", "Mathematics", "10:00–11:30 AM", "Home Visit"],
              ["Sara B.", "Physics", "2:00–3:30 PM", "Online"],
              ["Meron H.", "Statistics", "5:00–6:00 PM", "Home Visit"],
            ].map(([child, subject, time, type]) => (
              <div
                key={child}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
              >
                <div className="h-12 w-2 flex-shrink-0 rounded-full bg-teal-500" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    {subject} · {child}
                  </p>
                  <p className="text-xs text-slate-400">
                    {time} · {type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]">
            <p className="mb-2 text-sm font-bold text-slate-800 dark:text-white">
              🔗 Connects Balance
            </p>
            <p className="text-3xl font-extrabold text-teal-600">24</p>
            <p className="mb-3 text-xs text-slate-400">≈ 12 job applications</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              🛡️ Fully Verified
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              National ID · Degree · Badges active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}