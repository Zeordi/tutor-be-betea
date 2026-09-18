"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminSupportTicket } from "@/lib/adminApi";

type StatusFilter = "ALL" | "OPEN" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

const STATUS_OPTIONS: StatusFilter[] = ["ALL", "OPEN", "UNDER_REVIEW", "APPROVED", "REJECTED"];

function statusStyle(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    case "UNDER_REVIEW":
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "REJECTED":
      return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<AdminSupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.tickets({
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      if (!cancelled) setTickets(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load tickets");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support & Disputes"
        subtitle="Replacement requests, safety reports, escrow disputes"
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

      <div className="space-y-3">
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">Loading…</div>
        ) : tickets.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">No tickets found.</div>
        ) : (
          tickets.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {t.reasonType.replace(/_/g, " ")} · {t.id.slice(0, 8)}
                  </p>
                  {t.contractId && (
                    <p className="text-xs text-slate-400">Contract {t.contractId.slice(0, 8)}</p>
                  )}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusStyle(t.status)}`}
                >
                  {t.status.replace(/_/g, " ")}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Submitted {t.createdAt ? new Date(t.createdAt).toLocaleString() : "—"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
