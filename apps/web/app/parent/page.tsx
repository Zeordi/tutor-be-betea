export default function ParentHomePage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="mb-1 text-xl font-extrabold text-slate-800 dark:text-white">
          Good morning 👋
        </h2>
        <p className="text-sm text-slate-500">
          Here&apos;s your family dashboard overview
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Active Sessions", "3", "+1 today", "📚"],
          ["Avg. Progress", "89%", "↑ 4%", "📊"],
          ["Escrow Held", "12,450 ETB", "2 contracts", "🔒"],
          ["Upcoming", "4", "This week", "📅"],
        ].map(([label, value, sub, icon]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]"
          >
            <div className="mb-3 flex items-start justify-between">
              <span className="text-2xl">{icon}</span>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                {sub}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-teal-600">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240] md:col-span-2">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">
            Upcoming Sessions
          </h3>
          <div className="space-y-3">
            {[
              ["Kidane · Math", "Selamawit T.", "Today 4:00 PM", "confirmed"],
              ["Meron · English", "Tigist H.", "Tomorrow 10:00 AM", "confirmed"],
              ["Kidane · Physics", "Bereket S.", "Wed 3:30 PM", "pending"],
            ].map(([name, tutor, time, status]) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-lg dark:bg-teal-900/30">
                  📚
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {tutor} · {time}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    status === "confirmed"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">
            Children Summary
          </h3>
          <div className="space-y-3">
            {[
              ["Kidane M.", "Gr. 10", "87%"],
              ["Meron H.", "Gr. 8", "92%"],
            ].map(([name, grade, prog]) => (
              <div
                key={name}
                className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">
                      {name}
                    </p>
                    <p className="text-[10px] text-slate-400">{grade}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-teal-500"
                      style={{ width: prog }}
                    />
                  </div>
                  <span className="text-xs font-bold text-teal-600">{prog}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}