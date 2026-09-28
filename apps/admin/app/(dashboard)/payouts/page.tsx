"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminPayout } from "@/lib/adminApi";

const PROVIDER_COLOR: Record<string, string> = {
  TELEBIRR: "#0072CE",
  CBE_BIRR: "#8A1538",
  MPESA: "#00A859",
  STRIPE: "#635BFF",
  MANUAL: "#6B7280",
};

function statusLabel(status: string): string {
  switch (status) {
    case "PENDING":
      return "pending";
    case "PROCESSING":
      return "ready";
    case "PAID":
      return "paid";
    case "FAILED":
      return "failed";
    default:
      return status.toLowerCase();
  }
}

function statusStyle(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "PENDING":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    case "PROCESSING":
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "FAILED":
      return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }
}

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<AdminPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.payouts();
      if (!cancelled) setPayouts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load payouts");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markPaid = async (id: string) => {
    setUpdating(id);
    try {
      await adminApi.payoutUpdate(id, "PAID");
      setPayouts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "PAID" } : p)),
      );
    } catch (err: any) {
      alert(err.message || "Failed to update payout");
    } finally {
      setUpdating(null);
    }
  };

  const readyTotal = payouts
    .filter((p) => p.status === "PROCESSING")
    .reduce((s, p) => s + Number(p.amount), 0);
  const pendingCount = payouts.filter((p) => p.status === "PENDING").length;
  const paidCount = payouts.filter((p) => p.status === "PAID").length;
  const failedCount = payouts.filter((p) => p.status === "FAILED").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payout Reconciliation"
        subtitle="Telebirr · CBE Birr · M-Pesa color-coded"
        action={
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {payouts.length} total
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              {paidCount} paid
            </span>
            <span className="rounded-full bg-red-50 px-3 py-1 text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {failedCount} failed
            </span>
          </div>
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-xl font-black text-teal-600">
            {readyTotal.toLocaleString()} <span className="text-sm font-semibold text-slate-500">ETB</span>
          </p>
          <p className="mt-2 text-xs text-slate-500">Ready to pay</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-xl font-black text-amber-600">{pendingCount}</p>
          <p className="mt-2 text-xs text-slate-500">Pending</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-xl font-black text-emerald-600">{paidCount}</p>
          <p className="mt-2 text-xs text-slate-500">Paid</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">Loading…</div>
      ) : payouts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">No payouts found.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#112240]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                {["Tutor", "Method", "Amount", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => {
                const label = statusLabel(p.status);
                const color = PROVIDER_COLOR[p.provider || "MANUAL"] || "#6B7280";
                return (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 dark:border-slate-800/60">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {p.teacher?.fullName || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                        style={{ background: `${color}18`, color: color }}
                      >
                        {p.provider || "MANUAL"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                      {Number(p.amount).toLocaleString()} ETB
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${statusStyle(p.status)}`}
                      >
                        {label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.status === "PROCESSING" && (
                        <button
                          type="button"
                          onClick={() => markPaid(p.id)}
                          disabled={updating === p.id}
                          className="rounded-lg bg-teal-600 px-3 py-1 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50"
                        >
                          {updating === p.id ? "…" : "Pay"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
