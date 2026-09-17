"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { adminApi, type AdminDashboardStats } from "@/lib/adminApi";

type Kpi = {
  label: string;
  value: string;
  delta?: string;
  icon: string;
  tone: "teal" | "blue" | "purple" | "amber" | "orange" | "emerald";
};

function mapStatsToKpis(stats: AdminDashboardStats | null): Kpi[] {
  if (!stats) {
    return [
      { label: "Total Users", value: "—", delta: "", icon: "👥", tone: "teal" },
      { label: "Active Tutors", value: "—", delta: "", icon: "🧑‍🏫", tone: "blue" },
      { label: "Active Contracts", value: "—", delta: "", icon: "📅", tone: "purple" },
      { label: "Escrow Balance", value: "—", delta: "", icon: "💰", tone: "amber" },
      { label: "Pending Verif.", value: "—", delta: "", icon: "⏳", tone: "orange" },
      { label: "Open Tickets", value: "—", delta: "", icon: "🎫", tone: "emerald" },
    ];
  }
  return [
    { label: "Total Users", value: String(stats.tutors + stats.parents), delta: "", icon: "👥", tone: "teal" },
    { label: "Active Tutors", value: String(stats.tutors), delta: "", icon: "🧑‍🏫", tone: "blue" },
    { label: "Active Contracts", value: String(stats.activeContracts), delta: "", icon: "📅", tone: "purple" },
    { label: "Escrow Balance", value: "Live", delta: "", icon: "💰", tone: "amber" },
    { label: "Pending Verif.", value: String(stats.pendingVerifications), delta: "", icon: "⏳", tone: "orange" },
    { label: "Open Tickets", value: String(stats.openTickets), delta: "", icon: "🎫", tone: "emerald" },
  ];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    adminApi
      .dashboard()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load dashboard");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const kpis = mapStatsToKpis(stats);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        subtitle="Live platform health across users, escrow, and verification"
        action={
          <Link
            href="/verification"
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"
          >
            Review Queue →
          </Link>
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((k) => (
          <StatCard key={k.label} {...k} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Verification Queue Snapshot</h3>
          <div className="space-y-3">
            {[
              ["Selamawit Tadesse", "Degree + Fayda", "High"],
              ["Bereket Solomon", "Police Clearance", "Normal"],
              ["Tigist Haile", "National ID", "High"],
            ].map(([name, docs, priority]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{name}</p>
                  <p className="text-xs text-slate-500">{docs}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    priority === "High"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {priority}
                </span>
              </div>
            ))}
          </div>
          <Link href="/verification" className="mt-4 inline-block text-sm font-bold text-teal-600">
            Open full queue →
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Recent Audit Events</h3>
          <div className="space-y-2 font-mono text-[11px]">
            {[
              { hash: "a3f8c2…", user: "admin@tbb.et", action: "VAULT_ACCESS · Fayda ID", level: "high" },
              { hash: "b7d1e9…", user: "system", action: "ESCROW_RELEASE · 2,700 ETB", level: "normal" },
              { hash: "c2a4f7…", user: "admin@tbb.et", action: "VERIFICATION_APPROVE", level: "high" },
              { hash: "e6c8a2…", user: "admin@tbb.et", action: "USER_SUSPEND · Fraud", level: "critical" },
            ].map((log) => (
              <div
                key={log.hash}
                className={`flex flex-wrap gap-2 rounded-lg px-3 py-2 ${
                  log.level === "critical"
                    ? "bg-red-50 dark:bg-red-900/20"
                    : log.level === "high"
                      ? "bg-amber-50 dark:bg-amber-900/20"
                      : "bg-slate-50 dark:bg-slate-800/50"
                }`}
              >
                <span className="text-slate-400">{log.hash}</span>
                <span className="text-blue-600 dark:text-blue-400">{log.user}</span>
                <span className="text-slate-600 dark:text-slate-400">{log.action}</span>
              </div>
            ))}
          </div>
          <Link href="/audit-logs" className="mt-4 inline-block text-sm font-bold text-teal-600">
            View immutable ledger →
          </Link>
        </div>
      </div>
    </div>
  );
}