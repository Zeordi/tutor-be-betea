"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminVerificationItem } from "@/lib/adminApi";

type Priority = "High" | "Normal";

function priorityClass(priority: Priority) {
  return priority === "High"
    ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
}

function priorityFor(docType: string): Priority {
  return docType === "NATIONAL_ID" || docType === "DEGREE" ? "High" : "Normal";
}

function relativeTime(iso: string) {
  const now = new Date();
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export default function VerificationQueuePage() {
  const [queue, setQueue] = useState<AdminVerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.verificationQueue();
      if (!cancelled) setQueue(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load verification queue");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (teacherId: string) => {
    setActionId(teacherId);
    try {
      await adminApi.approveVerification(teacherId);
      setQueue((prev) => prev.filter((item) => item.teacherId !== teacherId));
    } catch (err: any) {
      alert(err.message || "Failed to approve");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (teacherId: string) => {
    const reason = prompt("Rejection reason (optional):") || "Documents unclear";
    setActionId(teacherId);
    try {
      await adminApi.rejectVerification(teacherId, reason);
      setQueue((prev) => prev.filter((item) => item.teacherId !== teacherId));
    } catch (err: any) {
      alert(err.message || "Failed to reject");
    } finally {
      setActionId(null);
    }
  };

  const displayQueue = queue.slice(0, 50);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification Queue"
        subtitle={`${displayQueue.length} pending verifications · Sorted by submission date`}
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">
          Loading…
        </div>
      ) : displayQueue.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">
          No pending verifications.
        </div>
      ) : (
        <div className="space-y-3">
          {displayQueue.map((row) => {
            const busy = actionId === row.teacherId;
            return (
              <div
                key={row.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]"
              >
                <div className="flex flex-wrap items-start gap-3 sm:flex-nowrap">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                    {row.teacherId.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {row.teacherId}
                    </p>
                    <p className="text-xs text-slate-500">
                      Submitted {relativeTime(row.createdAt)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {row.documentType.replace(/_/g, " ")}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${priorityClass(priorityFor(row.documentType))}`}
                      >
                        {priorityFor(row.documentType)}
                      </span>
                    </div>
                    {row.adminNote && (
                      <p className="mt-2 text-[10px] text-amber-600 dark:text-amber-400">
                        Note: {row.adminNote}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(row.teacherId)}
                      disabled={busy}
                      className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50"
                    >
                      {busy ? "…" : "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(row.teacherId)}
                      disabled={busy}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
