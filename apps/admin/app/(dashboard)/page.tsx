"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { adminApi, type AdminDashboardStats, type AdminVerificationItem, type AdminAuditLog } from "@/lib/adminApi";

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
    { label: "Escrow Balance", value: "—", delta: "", icon: "💰", tone: "amber" },
    { label: "Pending Verif.", value: String(stats.pendingVerifications), delta: "", icon: "⏳", tone: "orange" },
    { label: "Open Tickets", value: String(stats.openTickets), delta: "", icon: "🎫", tone: "emerald" },
  ];
}

type Severity = "success" | "error" | "warning" | "info";

function getSeverity(actionType: string, status?: string): Severity {
  const lower = actionType.toLowerCase();
  if (lower.includes("approve")) return "success";
  if (lower.includes("reject") || lower.includes("suspend") || lower.includes("risk")) return "error";
  if (lower.includes("flag") || lower.includes("warn") || status === "PENDING") return "warning";
  return "info";
}

function severityClass(severity: Severity) {
  switch (severity) {
    case "success":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "error":
      return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    case "warning":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    case "info":
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
  }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verificationQueue, setVerificationQueue] = useState<AdminVerificationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);

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
    adminApi
      .verificationQueue()
      .then((data) => {
        if (!cancelled) setVerificationQueue(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
    adminApi
      .auditLogs(10)
      .then((data) => {
        if (!cancelled) setAuditLogs(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const kpis = mapStatsToKpis(stats);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const verificationActivities: {
    id: string;
    title: string;
    subtitle: string;
    severity: Severity;
    timestamp: string;
  }[] = verificationQueue.map((item) => ({
    id: `verif-${item.id}`,
    title: `Verification: ${item.documentType.replace(/_/g, " ")}`,
    subtitle: `Teacher ${item.teacherId}`,
    severity: getSeverity(item.status || "PENDING", item.status),
    timestamp: item.createdAt,
  }));

  const auditActivities: {
    id: string;
    title: string;
    subtitle: string;
    severity: Severity;
    timestamp: string;
  }[] = auditLogs.map((log) => ({
    id: `audit-${log.id}`,
    title: log.actionType,
    subtitle: log.targetUserId ? `User ${log.targetUserId}` : `Admin ${log.adminId}`,
    severity: getSeverity(log.actionType),
    timestamp: log.createdAt,
  }));

  const recentActivity = [...verificationActivities, ...auditActivities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={`Tutor Be Betea · ${dateStr}`}
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
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Sessions by Day (This Week)</h3>
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">No session data available</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Revenue Breakdown</h3>
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">No revenue data available</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
        <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Recent Activity</h3>
        <div className="space-y-2">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity</p>
          ) : (
            recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-500">{activity.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${severityClass(activity.severity)}`}>
                    {activity.severity}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex gap-3">
          <Link href="/verification" className="text-sm font-bold text-teal-600 hover:text-teal-700">
            Verification Queue →
          </Link>
          <Link href="/audit-logs" className="text-sm font-bold text-teal-600 hover:text-teal-700">
            Audit Log →
          </Link>
        </div>
      </div>
    </div>
  );
}
