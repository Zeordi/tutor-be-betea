"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type Transaction = {
  id: string;
  amount: number;
  currency: string;
  provider: string;
  status: string;
  externalRef: string | null;
  createdAt: string;
  contractId: string | null;
};

type WalletData = {
  escrowHeld: number;
  transactions: Transaction[];
};

export default function ParentWalletPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wallet, setWallet] = useState<WalletData | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<WalletData>(paths.wallet)
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

  const successTransactions = (wallet?.transactions || []).filter((t) => t.status === "SUCCESS");
  const availableBalance = successTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const escrowHeld = wallet?.escrowHeld || 0;
  const transactions = wallet?.transactions || [];

  function txIcon(status: string, provider: string) {
    if (status === "SUCCESS") return "✅";
    if (status === "PENDING") return "⏳";
    if (status === "FAILED") return "❌";
    return "💰";
  }

  function txTypeLabel(status: string, provider: string) {
    if (status === "SUCCESS") return "Payment";
    if (status === "PENDING") return "Pending";
    if (status === "FAILED") return "Failed";
    return "Payment";
  }

  const linkedContracts = transactions.filter((t) => t.contractId);
  const pendingEscrows = linkedContracts.filter((t) => t.status === "PENDING");

  if (loading) {
    return (
      <div className="space-y-5 p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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

  return (
    <div className="space-y-5 p-6">
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Wallet & Payments</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 p-6 text-white md:col-span-2">
          <p className="mb-1 text-sm opacity-80">Available Balance</p>
          <p className="mb-5 text-4xl font-extrabold">
            {availableBalance.toLocaleString()} <span className="text-xl opacity-70">ETB</span>
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-xl bg-white/15 py-2.5 text-sm font-bold backdrop-blur transition hover:bg-white/25"
              disabled
            >
              📤 Withdraw
            </button>
            <Link
              href="/parent/checkout"
              className="flex-1 rounded-xl bg-white/15 py-2.5 text-center text-sm font-bold backdrop-blur transition hover:bg-white/25"
            >
              ➕ Top Up
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="mb-3 text-sm font-bold text-slate-500">Escrow Held</p>
          <p className="mb-1 text-2xl font-extrabold text-amber-500">
            {escrowHeld.toLocaleString()} ETB
          </p>
          <p className="mb-4 text-xs text-slate-400">
            {linkedContracts.length} linked contract{linkedContracts.length === 1 ? "" : "s"}
          </p>
          <div className="space-y-2">
            {pendingEscrows.slice(0, 3).map((t) => (
              <div key={t.id} className="flex justify-between text-xs">
                <span className="truncate text-slate-500">
                  {t.provider} · {t.contractId?.slice(0, 8)}
                </span>
                <span className="ml-2 shrink-0 font-semibold text-slate-700 dark:text-slate-300">
                  {Number(t.amount).toLocaleString()} ETB
                </span>
              </div>
            ))}
            {pendingEscrows.length === 0 && (
              <p className="text-xs text-slate-400">No active escrow</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
        <h3 className="mb-4 font-bold text-slate-800 dark:text-white">Transaction History</h3>
        <div className="space-y-2">
          {transactions.length === 0 && (
            <p className="text-sm text-slate-400">No transactions yet.</p>
          )}
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                  tx.status === "SUCCESS"
                    ? "bg-emerald-50 dark:bg-emerald-900/20"
                    : tx.status === "PENDING"
                      ? "bg-amber-50 dark:bg-amber-900/20"
                      : "bg-red-50 dark:bg-red-900/20"
                }`}
              >
                {txIcon(tx.status, tx.provider)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {txTypeLabel(tx.status, tx.provider)} · {tx.provider}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {new Date(tx.createdAt).toLocaleDateString()} · {tx.externalRef ? `Ref: ${tx.externalRef.slice(0, 12)}` : "No ref"}
                </p>
              </div>
              <p
                className={`text-sm font-extrabold ${
                  tx.status === "SUCCESS" ? "text-emerald-600" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {Number(tx.amount).toLocaleString()} ETB
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
