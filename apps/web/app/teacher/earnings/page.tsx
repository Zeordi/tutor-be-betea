"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

type Payout = {
  id: string;
  amount: number;
  provider: string;
  status: string;
  createdAt: string;
  paidAt?: string;
};

type TeacherEarnings = {
  totalEarned: number;
  pendingPayout: number;
  payouts: Payout[];
};

const PROVIDER_LABELS: Record<string, string> = {
  TELEBIRR: "Telebirr",
  CBE_BIRR: "CBE Birr",
  MPESA: "M-Pesa",
};

export default function TeacherEarningsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [earnings, setEarnings] = useState<TeacherEarnings | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawProvider, setWithdrawProvider] = useState("TELEBIRR");
  const [submitting, setSubmitting] = useState(false);
  const [providerStatus, setProviderStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.allSettled([
      apiFetch<TeacherEarnings>(paths.teacherEarnings),
      apiFetch<Record<string, boolean>>("/payments/status/check"),
    ]).then((results) => {
      if (cancelled) return;
      const earningsResult = results[0];
      const statusResult = results[1];

      if (earningsResult.status === "fulfilled") {
        setEarnings(earningsResult.value || null);
      } else if (earningsResult.status === "rejected") {
        setError(earningsResult.reason?.message || "Failed to load earnings");
      }

      if (statusResult.status === "fulfilled") {
        const status = statusResult.value || {};
        setProviderStatus(status);
        const available = Object.entries(status).filter(([, v]) => v).map(([k]) => k);
        if (available.length > 0 && !available.includes(withdrawProvider)) {
          setWithdrawProvider(available[0]);
        }
      }
    }).catch((err) => {
      if (!cancelled) setError(err.message || "Failed to load earnings");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  const availableProviders = useMemo(
    () => Object.entries(providerStatus).filter(([, v]) => v).map(([k]) => k),
    [providerStatus]
  );

  const canWithdraw =
    availableProviders.length > 0 &&
    !!earnings &&
    earnings.pendingPayout > 0;

  const recentPayouts = useMemo(() => {
    if (!earnings?.payouts) return [];
    return [...earnings.payouts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [earnings]);

  const payoutMethods = useMemo(() => {
    return Object.entries(providerStatus).map(([provider, active]) => ({
      provider,
      active,
      label: PROVIDER_LABELS[provider] || provider,
    }));
  }, [providerStatus]);

  const handleWithdraw = async () => {
    if (!earnings) return;
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (amount > earnings.pendingPayout) {
      setError("Amount exceeds available balance");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await apiFetch(paths.payoutRequest, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, provider: withdrawProvider }),
      });
      setWithdrawAmount("");
      setError("");
      const updated = await apiFetch<TeacherEarnings>(paths.teacherEarnings);
      setEarnings(updated);
      alert("Payout request submitted");
    } catch (err: any) {
      setError(err.message || "Payout failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 p-4 md:p-8">
        <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800 md:col-span-2" />
        </div>
      </div>
    );
  }

  if (error && !earnings) {
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

  if (!earnings) {
    return (
      <div className="p-6">
        <p className="text-sm text-[var(--secondary)]">No earnings data</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 md:p-8">
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Earnings & Payouts</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-4 md:col-span-1">
          <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 p-5 text-white shadow-sm">
            <p className="text-xs font-semibold opacity-80">Available to Withdraw</p>
            <p className="mt-1 text-3xl font-extrabold">
              {earnings.pendingPayout.toLocaleString()}{" "}
              <span className="text-base opacity-70">ETB</span>
            </p>
            <p className="mt-1 text-[10px] opacity-60">
              {earnings.totalEarned.toLocaleString()} ETB total earned
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-white">Withdraw</h3>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Amount"
              className="mb-2 w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm font-bold text-[var(--foreground)] outline-none"
            />
            {availableProviders.length === 0 ? (
              <p className="mb-2 text-xs text-slate-500">No payout providers configured.</p>
            ) : (
              <select
                value={withdrawProvider}
                onChange={(e) => setWithdrawProvider(e.target.value)}
                className="mb-2 w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm font-bold text-[var(--foreground)] outline-none"
              >
                {availableProviders.map((p) => (
                  <option key={p} value={p}>
                    {PROVIDER_LABELS[p] || p}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={submitting || !canWithdraw}
              className="w-full rounded-xl bg-[var(--primary)] py-2 text-sm font-bold text-white disabled:opacity-70"
            >
              {submitting ? "Requesting…" : "Withdraw"}
            </button>
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          </div>
        </div>

        <div className="space-y-4 md:col-span-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <h3 className="mb-4 font-bold text-slate-800 dark:text-white">6-Month Trend</h3>
            <div className="flex h-32 items-end gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-lg bg-slate-100 dark:bg-slate-800"
                  style={{ height: "35%" }}
                />
              ))}
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-400">
              Transaction history will appear here
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <h3 className="mb-3 font-bold text-slate-800 dark:text-white">Payout Methods</h3>
            {payoutMethods.length === 0 ? (
              <p className="text-sm text-slate-400">No payout methods configured.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {payoutMethods.map((method) => (
                  <div key={method.provider} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {method.label}
                      </p>
                      <p className="text-[10px] text-slate-400">{method.provider}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        method.active
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {method.active ? "Active" : "Link"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <h3 className="mb-3 font-bold text-slate-800 dark:text-white">Recent Transactions</h3>
            {recentPayouts.length === 0 ? (
              <p className="text-sm text-slate-400">No transactions yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentPayouts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                        +{Number(p.amount).toLocaleString()} ETB
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(p.createdAt).toLocaleDateString()} · {p.provider}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        p.status === "PAID"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : p.status === "PROCESSING"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
