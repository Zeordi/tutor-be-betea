"use client";

import { useEffect, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

type Wallet = {
  balance: number;
  currency: string;
  pendingBalance: number;
  lastMonthEarnings: number;
  monthEarnings: number;
  payoutMethods: {
    id: string;
    provider: string;
    label: string;
    details: string;
    active: boolean;
    icon?: string;
  }[];
  transactions: {
    id: string;
    description: string;
    amount: number;
    type: "DEBIT" | "CREDIT";
    date: string;
  }[];
  monthlyTrend: { month: string; amount: number }[];
};

export default function TeacherEarningsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<Wallet>(paths.wallet)
      .then((data) => {
        if (!cancelled) setWallet(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load wallet");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const pctChange =
    wallet?.lastMonthEarnings && wallet.lastMonthEarnings > 0
      ? ((wallet.monthEarnings - wallet.lastMonthEarnings) / wallet.lastMonthEarnings) * 100
      : 0;

  if (loading) {
    return (
      <div className="space-y-5 p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="rounded-2xl h-32 animate-pulse bg-slate-100 dark:bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!wallet) {
    return <div className="p-6"><p className="text-sm text-[var(--secondary)]">No wallet data</p></div>;
  }

  const trend = wallet.monthlyTrend || [];
  const maxVal = Math.max(...trend.map((t) => t.amount), 1);

  return (
    <div className="space-y-5 p-6">
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Earnings & Payouts</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 p-5 text-white">
          <p className="mb-1 text-sm opacity-70">This Month</p>
          <p className="mb-1 text-3xl font-extrabold">
            {wallet.monthEarnings.toLocaleString()} <span className="text-base opacity-70">ETB</span>
          </p>
          <p className={`mb-4 text-xs opacity-60 ${pctChange >= 0 ? "↑" : "↓"} ${pctChange.toFixed(0)}% vs last month`}
          />
          <button className="w-full rounded-xl bg-white/15 py-2 text-sm font-bold">Withdraw Now</button>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240] md:col-span-2">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">6-Month Trend</h3>
          {trend.length === 0 ? (
            <p className="text-sm text-slate-400">No earnings data yet.</p>
          ) : (
            <div className="flex h-32 items-end gap-2">
              {trend.map((t) => (
                <div key={t.month} className="flex flex-1 flex-col items-center gap-1">
                  <p className="text-[9px] text-slate-400">{(t.amount / 1000).toFixed(1)}k</p>
                  <div
                    className="w-full overflow-hidden rounded-lg bg-teal-100 dark:bg-teal-900/30"
                    style={{ height: `${(t.amount / maxVal) * 90}px` }}
                  >
                    <div className="h-full rounded-lg bg-gradient-to-t from-teal-700 to-teal-400" />
                  </div>
                  <p className="text-[9px] text-slate-400">{t.month}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">Payout Methods</h3>
          <div className="space-y-3">
            {wallet.payoutMethods.map((pm) => (
              <div
                key={pm.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-700"
              >
                <span className="text-xl">{pm.icon || "🏦"}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{pm.label}</p>
                  <p className="text-xs text-slate-400">{pm.details}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    pm.active
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                  }`}
                >
                  {pm.active ? "Active" : "Link"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">Recent Transactions</h3>
          <div className="space-y-2">
            {wallet.transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-2 border-b border-slate-100 py-2 last:border-0 dark:border-slate-800"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
                    tx.type === "CREDIT" ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-slate-50 dark:bg-slate-800"
                  }`}
                >
                  {tx.type === "CREDIT" ? "💚" : "📤"}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{tx.description}</p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
                <p
                  className={`text-sm font-bold ${
                    tx.type === "CREDIT" ? "text-emerald-600" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {tx.type === "CREDIT" ? "+" : "-"}
                  {tx.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
