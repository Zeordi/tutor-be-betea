"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminContract } from "@/lib/adminApi";

type StatusFilter = "ALL" | "PENDING_ESCROW" | "ACTIVE" | "DISPUTED" | "COMPLETED" | "REFUNDED";

const STATUS_OPTIONS: StatusFilter[] = [
  "ALL",
  "PENDING_ESCROW",
  "ACTIVE",
  "DISPUTED",
  "COMPLETED",
  "REFUNDED",
];

function statusStyle(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "ACTIVE":
      return "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300";
    case "PENDING_ESCROW":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    case "DISPUTED":
      return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    case "REFUNDED":
      return "bg-slate-100 text-slate-600 dark:bg-slate-800";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800";
  }
}

function initialsFrom(id: string) {
  return id.slice(0, 2).toUpperCase();
}

export default function EscrowMonitoringPage() {
  const [contracts, setContracts] = useState<AdminContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.contracts({
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      if (!cancelled) setContracts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load contracts");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const totalEscrow = contracts.reduce((s, c) => s + Number(c.escrowHeldAmount), 0);
  const activeCount = contracts.filter((c) => c.status === "ACTIVE").length;
  const disputedCount = contracts.filter((c) => c.status === "DISPUTED").length;
  const disputedAmount = contracts
    .filter((c) => c.status === "DISPUTED")
    .reduce((s, c) => s + Number(c.escrowHeldAmount), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Escrow Monitoring"
        subtitle="Funds held until verified attendance / parent confirmation"
        action={
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1 ${
                  statusFilter === s
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {s === "ALL" ? "All" : s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-2xl font-extrabold text-teal-600">
            {totalEscrow.toLocaleString()} <span className="text-sm font-semibold text-slate-500">ETB</span>
          </p>
          <p className="mt-2 text-xs text-slate-500">Total escrow held</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-2xl font-extrabold text-teal-600">
            {activeCount}
          </p>
          <p className="mt-2 text-xs text-slate-500">Pending release</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-2xl font-extrabold text-red-600">
            {disputedCount > 0
              ? `${disputedCount} (${disputedAmount.toLocaleString()} ETB)`
              : "0"}
          </p>
          <p className="mt-2 text-xs text-slate-500">Disputed</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">
          Loading…
        </div>
      ) : contracts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">
          No contracts found.
        </div>
      ) : (
        <div className="space-y-3">
          {contracts.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]"
            >
              <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                  {initialsFrom(c.parentId)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {Number(c.agreedAmount).toLocaleString()} ETB
                  </p>
                  <p className="text-xs text-slate-500">
                    Parent {c.parentId.slice(0, 8)} → Tutor {c.teacherId.slice(0, 8)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle(c.status)}`}>
                    {c.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-slate-500">
                    Held: {Number(c.escrowHeldAmount).toLocaleString()} ETB
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                {c.startDate && (
                  <span>Started {new Date(c.startDate).toLocaleDateString()}</span>
                )}
                {c.endDate && (
                  <span>· Ends {new Date(c.endDate).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
