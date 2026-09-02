export default function TeacherEarningsPage() {
  const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const values = [8200, 9400, 10800, 9600, 11200, 12800];
  const maxVal = Math.max(...values);

  return (
    <div className="space-y-5 p-6">
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Earnings & Payouts</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 p-5 text-white">
          <p className="mb-1 text-sm opacity-70">This Month</p>
          <p className="mb-1 text-3xl font-extrabold">
            12,800 <span className="text-base opacity-70">ETB</span>
          </p>
          <p className="mb-4 text-xs opacity-60">↑ 14% vs last month</p>
          <button className="w-full rounded-xl bg-white/15 py-2 text-sm font-bold">Withdraw Now</button>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240] md:col-span-2">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">6-Month Trend</h3>
          <div className="flex h-32 items-end gap-2">
            {months.map((m, i) => (
              <div key={m} className="flex flex-1 flex-col items-center gap-1">
                <p className="text-[9px] text-slate-400">{(values[i] / 1000).toFixed(1)}k</p>
                <div
                  className="w-full overflow-hidden rounded-lg bg-teal-100 dark:bg-teal-900/30"
                  style={{ height: `${(values[i] / maxVal) * 90}px` }}
                >
                  <div className="h-full rounded-lg bg-gradient-to-t from-teal-700 to-teal-400" />
                </div>
                <p className="text-[9px] text-slate-400">{m}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">Payout Methods</h3>
          <div className="space-y-3">
            {[
              ["📱", "Telebirr", "**** 4521", true],
              ["🏦", "CBE Birr", "**** 8823", true],
              ["📲", "M-Pesa", "Not linked", false],
            ].map(([icon, name, num, active]) => (
              <div
                key={String(name)}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-700"
              >
                <span className="text-xl">{icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{name}</p>
                  <p className="text-xs text-slate-400">{num}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    active
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                  }`}
                >
                  {active ? "Active" : "Link"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">Recent Transactions</h3>
          <div className="space-y-2">
            {[
              { desc: "Payout to Telebirr", amount: "8,000", sign: "-", date: "Aug 25" },
              { desc: "Session earnings (10)", amount: "4,800", sign: "+", date: "Aug 20" },
              { desc: "Session earnings (8)", amount: "3,840", sign: "+", date: "Aug 15" },
              { desc: "Connects purchase (20)", amount: "2,000", sign: "-", date: "Aug 10" },
            ].map((tx) => (
              <div
                key={tx.desc}
                className="flex items-center gap-2 border-b border-slate-100 py-2 last:border-0 dark:border-slate-800"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
                    tx.sign === "+" ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-slate-50 dark:bg-slate-800"
                  }`}
                >
                  {tx.sign === "+" ? "💚" : "📤"}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{tx.desc}</p>
                  <p className="text-[10px] text-slate-400">{tx.date}</p>
                </div>
                <p
                  className={`text-sm font-bold ${
                    tx.sign === "+" ? "text-emerald-600" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {tx.sign}
                  {tx.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}