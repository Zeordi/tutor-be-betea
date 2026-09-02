export default function ParentWalletPage() {
  return (
    <div className="space-y-5 p-6">
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Wallet & Payments</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 p-6 text-white md:col-span-2">
          <p className="mb-1 text-sm opacity-70">Available Balance</p>
          <p className="mb-4 text-4xl font-extrabold">
            12,450 <span className="text-xl opacity-70">ETB</span>
          </p>
          <div className="flex gap-3">
            <button className="flex-1 rounded-xl bg-white/15 py-2.5 text-sm font-bold backdrop-blur">
              📤 Withdraw
            </button>
            <button className="flex-1 rounded-xl bg-white/15 py-2.5 text-sm font-bold backdrop-blur">
              ➕ Top Up
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="mb-3 text-sm font-bold text-slate-500">Escrow Held</p>
          <p className="mb-1 text-2xl font-extrabold text-amber-500">10,800 ETB</p>
          <p className="mb-4 text-xs text-slate-400">2 active contracts</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Selamawit (Math)</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">5,400 ETB</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Tigist (English)</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">5,400 ETB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
        <h3 className="mb-4 font-bold text-slate-800 dark:text-white">Transaction History</h3>
        <div className="space-y-2">
          {[
            { desc: "Milestone released – Selamawit M2", amount: "+5,400", type: "release", date: "Aug 28" },
            { desc: "Escrow funded – Tigist Block 2", amount: "-3,200", type: "escrow", date: "Aug 20" },
            { desc: "Telebirr top-up", amount: "+10,000", type: "topup", date: "Aug 15" },
            { desc: "Subscription renewal – Elite", amount: "-4,200", type: "sub", date: "Aug 1" },
          ].map((tx) => (
            <div
              key={tx.desc}
              className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                  tx.type === "topup" || tx.type === "release"
                    ? "bg-emerald-50 dark:bg-emerald-900/20"
                    : "bg-amber-50 dark:bg-amber-900/20"
                }`}
              >
                {tx.type === "topup" ? "📱" : tx.type === "release" ? "✅" : tx.type === "escrow" ? "🔒" : "⭐"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{tx.desc}</p>
                <p className="text-xs text-slate-400">{tx.date}</p>
              </div>
              <p
                className={`text-sm font-extrabold ${
                  tx.amount.startsWith("+") ? "text-emerald-600" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {tx.amount} ETB
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}