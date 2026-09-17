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

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-2xl font-extrabold text-teal-600">{contracts.length}</p>
          <p className="mt-2 text-xs text-slate-500">Total contracts</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-2xl font-extrabold text-teal-600">{activeCount}</p>
          <p className="mt-2 text-xs text-slate-500">Active</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-2xl font-extrabold text-amber-600">{totalEscrow.toLocaleString()}</p>
          <p className="mt-2 text-xs text-slate-500">Escrow held (ETB)</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-2xl font-extrabold text-red-600">{disputedCount}</p>
          <p className="mt-2 text-xs text-slate-500">Disputed</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#112240]">
        <div className="grid grid-cols-12 gap-2 border-b border-slate-100 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:border-slate-800">
          <div className="col-span-2">Contract</div>
          <div className="col-span-2">Parent</div>
          <div className="col-span-2">Tutor</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-1">Escrow</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Start</div>
        </div>
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">Loading…</div>
        ) : contracts.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">No contracts found.</div>
        ) : (
          contracts.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-12 items-center gap-2 border-b border-slate-50 px-4 py-3 text-sm last:border-0 dark:border-slate-800/60"
            >
              <div className="col-span-2 font-bold text-slate-800 dark:text-white">{c.id.slice(0, 8)}</div>
              <div className="col-span-2 text-slate-600 dark:text-slate-300">{c.parentId.slice(0, 8)}</div>
              <div className="col-span-2 text-slate-600 dark:text-slate-300">{c.teacherId.slice(0, 8)}</div>
              <div className="col-span-2 font-bold text-slate-900 dark:text-white">
                {Number(c.agreedAmount).toLocaleString()} ETB
              </div>
              <div className="col-span-1 text-xs text-slate-500">
                {Number(c.escrowHeldAmount).toLocaleString()}
              </div>
              <div className="col-span-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusStyle(c.status)}`}>
                  {c.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="col-span-1 text-[11px] font-semibold text-slate-500">
                {c.startDate ? new Date(c.startDate).toLocaleDateString() : "—"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
