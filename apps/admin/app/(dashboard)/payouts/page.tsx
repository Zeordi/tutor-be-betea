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
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30";
    case "PENDING":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/30";
    case "PROCESSING":
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/30";
    case "FAILED":
      return "bg-red-50 text-red-700 dark:bg-red-900/30";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800";
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
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-900/30">
              {paidCount} paid
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
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-xl font-black text-[var(--primary)]">
            {readyTotal.toLocaleString()} ETB
          </p>
          <p className="text-xs text-[var(--secondary)]">Ready to pay</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-xl font-black text-[var(--primary)]">{pendingCount}</p>
          <p className="text-xs text-[var(--secondary)]">Pending</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-xl font-black text-[var(--primary)]">{paidCount}</p>
          <p className="text-xs text-[var(--secondary)]">Paid today</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              {["Tutor", "Method", "Amount", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-[11px] font-bold uppercase text-[var(--secondary)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : payouts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  No payouts found.
                </td>
              </tr>
            ) : (
              payouts.map((p) => {
                const label = statusLabel(p.status);
                const color = PROVIDER_COLOR[p.provider || "MANUAL"] || "#6B7280";
                return (
                  <tr key={p.id} className="border-b border-[var(--border)]">
                    <td className="px-4 py-3 font-bold text-[var(--foreground)]">
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
                    <td className="px-4 py-3 font-mono font-bold text-[var(--primary)]">
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
                          className="rounded-lg bg-[var(--primary)] px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
                        >
                          {updating === p.id ? "…" : "Pay"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
