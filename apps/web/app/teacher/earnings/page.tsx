"use client";

import { useEffect, useState } from "react";
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

    apiFetch<TeacherEarnings>(paths.teacherEarnings)
      .then((data) => {
        if (!cancelled) setEarnings(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load earnings");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    apiFetch<Record<string, boolean>>("/payments/status/check")
      .then((data) => {
        if (!cancelled) {
          setProviderStatus(data || {});
          const available = Object.entries(data || {}).filter(([, v]) => v).map(([k]) => k);
          if (available.length > 0 && !available.includes(withdrawProvider)) {
            setWithdrawProvider(available[0]);
          }
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  const availableProviders = Object.entries(providerStatus).filter(([, v]) => v).map(([k]) => k);
  const canWithdraw = availableProviders.length > 0 && earnings && earnings.pendingPayout > 0;

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
      <div className="space-y-5 p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="rounded-2xl h-32 animate-pulse bg-slate-100 dark:bg-slate-800" />
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
    return <div className="p-6"><p className="text-sm text-[var(--secondary)]">No earnings data</p></div>;
  }

  return (
    <div className="space-y-5 p-6">
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Earnings & Payouts</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 p-5 text-white">
          <p className="mb-1 text-sm opacity-70">Available to Withdraw</p>
          <p className="mb-1 text-3xl font-extrabold">
            {earnings.pendingPayout.toLocaleString()} <span className="text-base opacity-70">ETB</span>
          </p>
          <p className="mb-4 text-xs opacity-60">
            {earnings.totalEarned.toLocaleString()} ETB total earned
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Amount"
              className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white placeholder-white/60 outline-none"
            />
            {availableProviders.length === 0 ? (
              <p className="text-xs text-red-200">No payout providers are currently configured. Contact support.</p>
            ) : (
              <select
                value={withdrawProvider}
                onChange={(e) => setWithdrawProvider(e.target.value)}
                className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white outline-none"
              >
                {availableProviders.map((p) => (
                  <option key={p} value={p} className="text-black">
                    {p === "TELEBIRR" ? "Telebirr" : p === "CBE_BIRR" ? "CBE Birr" : p === "MPESA" ? "M-Pesa" : p}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={submitting || !canWithdraw}
              className="w-full rounded-xl bg-white/15 py-2 text-sm font-bold disabled:opacity-70"
            >
              {submitting ? "Requesting…" : availableProviders.length === 0 ? "No providers available" : "Withdraw"}
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-red-200">{error}</p>}
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240] md:col-span-2">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">Recent Payouts</h3>
          {earnings.payouts.length === 0 && (
            <p className="text-sm text-slate-400">No payouts yet.</p>
          )}
          <div className="space-y-2">
            {earnings.payouts.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {Number(p.amount).toLocaleString()} ETB
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(p.createdAt).toLocaleDateString()} · {p.provider}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  p.status === "PAID" ? "bg-emerald-50 text-emerald-700" :
                  p.status === "PROCESSING" ? "bg-amber-50 text-amber-700" :
                  "bg-slate-100 text-slate-600"
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
