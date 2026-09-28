"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminVaultDocument, type AdminAuditLog } from "@/lib/adminApi";

type VaultDoc = AdminVaultDocument;

function docStatusClass(status: string) {
  const s = status.toUpperCase();
  if (s === "VERIFIED" || s === "APPROVED")
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (s === "REJECTED")
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300";
  return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
}

function initialsFrom(id: string) {
  return id.slice(0, 2).toUpperCase();
}

export default function VaultPage() {
  const [cases, setCases] = useState<VaultDoc[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const [vaultData, logs] = await Promise.all([
        adminApi.vaultPending(),
        adminApi.auditLogs(50),
      ]);
      if (!cancelled) {
        setCases(Array.isArray(vaultData) ? vaultData : []);
        setAuditLogs(
          Array.isArray(logs)
            ? logs.filter(
                (log) =>
                  log.actionType === "DECRYPT_VAULT_DOCUMENT" ||
                  log.actionType === "AUTO_RELEASE_ESCROW" ||
                  log.actionType?.includes("VAULT"),
              )
            : [],
        );
      }
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load vault");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Vault (Admin Only)"
        subtitle={`Tutor Be Betea · ${dateStr}`}
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-red-200 bg-white p-4 dark:border-red-900 dark:bg-[#112240]">
        <p className="text-xs font-bold text-red-700 dark:text-red-400">
          🔐 Confidential Document Vault — Super Admin Only
        </p>
        <p className="mt-1 text-[11px] text-red-600/80 dark:text-red-500">
          AES-256 encrypted · Every access is audit-logged · Raw credentials are never shown on public profiles
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">
          Loading vault…
        </div>
      ) : cases.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#112240] dark:text-slate-400">
          No pending vault items.
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((row) => (
            <div
              key={row.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]"
            >
              <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                  {initialsFrom(row.teacherId)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {row.teacherId}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Documents visible to Super Admin only
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${docStatusClass(row.status)}`}
                >
                  {row.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div
                  className={`rounded-xl border-2 p-3 text-center ${docStatusClass(row.status)}`}
                >
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                    {row.documentType.replace(/_/g, " ")}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide">
                    {row.status === "VERIFIED"
                      ? "✓ Verified"
                      : row.status === "REJECTED"
                        ? "✗ Rejected"
                        : "⏳ Pending"}
                  </p>
                </div>
              </div>
              {row.adminNote && (
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Note: {row.adminNote}
                </p>
              )}
              <div className="mt-4">
                <Link
                  href={`/verification/${row.teacherId}`}
                  className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700"
                >
                  Open vault case
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
        <h3 className="mb-3 font-bold text-slate-900 dark:text-white">Vault access log</h3>
        <div className="space-y-2 font-mono text-[11px]">
          {auditLogs.length === 0 && !loading && (
            <p className="text-xs text-slate-400">No vault audit entries yet.</p>
          )}
          {auditLogs.map((log, i) => (
            <div
              key={log.id || i}
              className="flex flex-wrap gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50"
            >
              <span className="text-slate-500 dark:text-slate-400">{log.id?.slice(0, 8) || "—"}</span>
              <span className="text-teal-600 dark:text-teal-400">
                [{log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : "—"}]
              </span>
              <span className="text-blue-600 dark:text-blue-400">
                {log.adminId?.slice(0, 8) || "system"}
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {log.actionType.replace(/_/g, " ").toLowerCase()}
              </span>
            </div>
          ))}
        </div>
        <Link href="/audit-logs" className="mt-4 inline-block text-sm font-bold text-teal-600">
          Full immutable ledger →
        </Link>
      </div>
    </div>
  );
}
