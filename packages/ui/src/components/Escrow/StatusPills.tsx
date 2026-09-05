import React from "react";

export type EscrowStatus = "funded" | "in_escrow" | "released" | "disputed" | "pending";

const styles: Record<EscrowStatus, { label: string; cls: string }> = {
  funded: {
    label: "💰 Funded",
    cls: "border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  },
  in_escrow: {
    label: "🔒 In Escrow",
    cls: "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300",
  },
  released: {
    label: "✅ Released",
    cls: "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300",
  },
  disputed: {
    label: "⚠️ Disputed",
    cls: "border border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
  },
  pending: {
    label: "⏳ Pending",
    cls: "border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
  },
};

export interface EscrowStatusPillProps {
  status: EscrowStatus;
  detail?: string;
  className?: string;
}

export function EscrowStatusPill({ status, detail, className = "" }: EscrowStatusPillProps) {
  const s = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${s.cls} ${className}`}
    >
      {s.label}
      {detail ? ` · ${detail}` : ""}
    </span>
  );
}

export function EscrowStatusPillsRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <EscrowStatusPill status="funded" detail="5,400 ETB" />
      <EscrowStatusPill status="in_escrow" detail="Milestone 2/4" />
      <EscrowStatusPill status="released" detail="Aug 28" />
      <EscrowStatusPill status="disputed" detail="Under Review" />
      <EscrowStatusPill status="pending" detail="2 days" />
    </div>
  );
}

export default EscrowStatusPill;