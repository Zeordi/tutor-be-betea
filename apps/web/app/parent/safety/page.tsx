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
      <div className="mx-auto max-w-4xl space-y-5 p-6">
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
  const totalCases = disputes.length;
  const openIssues = disputes.filter((d) => d.status === "OPEN" || d.status === "UNDER_REVIEW").length;

  return (
    <div className="mx-auto max-w-4xl space-y-5 p-6">
      <h1 className="text-2xl font-black text-slate-800 dark:text-white">Safety Center</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Disputes, replacements, and trust tools
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          [
            "⚑",
            hasActiveDispute ? "1 open issue" : "No active flags",
            hasActiveDispute ? "Action required" : "All tutors safe",
            hasActiveDispute ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400",
          ],
          ["📋", `${totalCases} total cases`, "View history", "text-slate-700 dark:text-slate-300"],
          ["🔄", "0 replacements", "All sessions fine", "text-slate-700 dark:text-slate-300"],
        ].map(([icon, title, sub, color]) => (
          <div
            key={String(title)}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-[#112240]"
          >
            <div className="mb-2 text-2xl">{icon}</div>
            <p className={`font-extrabold ${color}`}>{title}</p>
            <p className="text-xs text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      {hasActiveDispute && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/20">
          <p className="mb-1 text-[10px] font-bold tracking-wide text-red-500">OPEN ISSUE</p>
          <p className="font-bold text-slate-800 dark:text-white">{activeDispute.type}</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {activeDispute.description}
          </p>
          <div className="mt-3 rounded-xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400">
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

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
        <p className="mb-3 font-extrabold text-slate-800 dark:text-white">Request replacement</p>
        <p className="mb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Not satisfied? We replace the tutor for free within 24 hours. Escrow carries over
          automatically.
        </p>
        <button
          type="button"
          className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white"
        >
          🔄 Request replacement tutor
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
        <p className="mb-4 font-extrabold text-slate-800 dark:text-white">Report a new problem</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/parent/support/create"
            className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center transition hover:border-teal-300 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-2 text-2xl">🚫</div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">No-Show</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tutor didn't attend</p>
          </Link>
          <Link
            href="/parent/support/create"
            className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center transition hover:border-teal-300 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-2 text-2xl">⚠️</div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">Safety concern</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Unsafe behaviour</p>
          </Link>
          <Link
            href="/parent/support/create"
            className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center transition hover:border-teal-300 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-2 text-2xl">💳</div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">Billing issue</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Payment problem</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
