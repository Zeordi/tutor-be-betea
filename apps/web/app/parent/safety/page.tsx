"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type SupportTicket = {
  id: string;
  reasonType: string;
  explanation: string;
  status: string;
  createdAt: string;
  contractId?: string | null;
};

type Dispute = {
  id: string;
  type: string;
  description: string;
  filedAt: string;
  status: string;
  escrowAmount: number;
  resolution: string | null;
};

function mapTicketToDispute(ticket: SupportTicket): Dispute {
  return {
    id: ticket.id,
    type: ticket.reasonType || "Support Ticket",
    description: ticket.explanation,
    filedAt: ticket.createdAt,
    status: ticket.status,
    escrowAmount: 0,
    resolution: null,
  };
}

export default function ParentSafetyPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<SupportTicket[]>(paths.supportMine)
      .then((data) => {
        if (!cancelled) {
          setTickets(data || []);
          setDisputes((data || []).map(mapTicketToDispute));
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load safety info");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeDispute = disputes.find((d) => d.status === "OPEN" || d.status === "UNDER_REVIEW");

  if (loading) {
    return (
      <div className="max-w-4xl space-y-5 p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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

  const hasActiveDispute = !!activeDispute;

  return (
    <div className="max-w-4xl space-y-5">
      <h1 className="text-2xl font-black text-[var(--foreground)]">Safety Center</h1>
      <p className="text-sm text-[var(--secondary)]">
        Disputes, replacements, and trust tools
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          hasActiveDispute
            ? ["⚑", "1 open issue", "Action required"]
            : ["🛡️", "No active flags", "All tutors safe"],
          ["📋", `${disputes.length} total cases`, "View history"],
          ["🔄", "0 replacements", "All sessions fine"],
        ].map(([icon, title, sub]) => (
          <div
            key={String(title)}
            className="rounded-2xl border border-[var(--border)] p-5 text-center"
          >
            <div className="mb-2 text-2xl">{icon}</div>
            <p className="font-extrabold text-[var(--foreground)]">{title}</p>
            <p className="text-xs opacity-80 text-[var(--secondary)]">{sub}</p>
          </div>
        ))}
      </div>

      {hasActiveDispute && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="mb-1 text-[10px] font-bold tracking-wide text-red-500">OPEN ISSUE</p>
          <p className="font-bold text-[var(--foreground)]">{activeDispute.type}</p>
          <p className="mt-2 text-sm text-[var(--secondary)]">
            {activeDispute.description}
          </p>
          <div className="mt-3 rounded-xl bg-[var(--muted)] p-3 text-sm text-[var(--secondary)]">
            Status: {activeDispute.status}
          </div>
          <button
            type="button"
            className="mt-4 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-white"
          >
            View case details
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 font-extrabold text-[var(--foreground)]">Request replacement</p>
        <p className="mb-5 text-sm leading-relaxed text-[var(--secondary)]">
          Not satisfied? We replace the tutor for free within 24 hours. Escrow carries over
          automatically.
        </p>
        <button
          type="button"
          className="w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm font-bold text-white"
        >
          🔄 Request replacement tutor
        </button>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-4 font-extrabold text-[var(--foreground)]">Report a new problem</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/parent/support/create"
            className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-5 text-center"
          >
            <div className="mb-2 text-2xl">🚫</div>
            <p className="text-sm font-bold text-[var(--foreground)]">No-Show</p>
            <p className="text-xs text-[var(--secondary)]">Tutor didn't attend</p>
          </Link>
          <Link
            href="/parent/support/create"
            className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-5 text-center"
          >
            <div className="mb-2 text-2xl">⚠️</div>
            <p className="text-sm font-bold text-[var(--foreground)]">Safety concern</p>
            <p className="text-xs text-[var(--secondary)]">Unsafe behaviour</p>
          </Link>
          <Link
            href="/parent/support/create"
            className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-5 text-center"
          >
            <div className="mb-2 text-2xl">💳</div>
            <p className="text-sm font-bold text-[var(--foreground)]">Billing issue</p>
            <p className="text-xs text-[var(--secondary)]">Payment problem</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
