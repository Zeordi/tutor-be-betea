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
        subtitle="Review tutor credentials before Trust Badges are issued"
        action={
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            {displayQueue.length} pending
          </span>
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#112240]">
        <div className="grid grid-cols-12 gap-2 border-b border-slate-100 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:border-slate-800">
          <div className="col-span-3">Tutor</div>
          <div className="col-span-3">Documents</div>
          <div className="col-span-2">Submitted</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Action</div>
        </div>
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">Loading…</div>
        ) : displayQueue.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">No pending verifications.</div>
        ) : (
          displayQueue.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-12 items-center gap-2 border-b border-slate-50 px-4 py-3 last:border-0 dark:border-slate-800/60"
            >
               <div className="col-span-3">
                 <p className="text-sm font-bold text-slate-800 dark:text-white">
                   {row.teacherId}
                 </p>
                 <p className="text-xs text-slate-400">
                   {row.documentType.replace(/_/g, " ")}
                 </p>
                 {row.adminNote && (
                   <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">
                     Note: {row.adminNote}
                   </p>
                 )}
               </div>
              <div className="col-span-3 flex flex-wrap gap-1">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {row.documentType.replace(/_/g, " ")}
                </span>
              </div>
              <div className="col-span-2 text-xs text-slate-500">
                {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}
              </div>
             <div className="col-span-2">
                 <span
                   className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${priorityClass(priorityFor(row.documentType))}`}
                 >
                   {priorityFor(row.documentType)}
                 </span>
               </div>
               <div className="col-span-2 flex flex-wrap gap-2">
                 <button
                   type="button"
                   onClick={() => handleApprove(row.teacherId)}
                   disabled={actionId === row.teacherId}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                   {actionId === row.teacherId ? "…" : "Approve"}
                </button>
                 <button
                   type="button"
                   onClick={() => handleReject(row.teacherId)}
                   disabled={actionId === row.teacherId}
                  className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}