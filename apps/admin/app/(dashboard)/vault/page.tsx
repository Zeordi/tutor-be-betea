"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminVaultDocument } from "@/lib/adminApi";

type VaultDoc = AdminVaultDocument & {
  user?: { fullName?: string; email?: string };
};

function riskClass(risk: string) {
  if (risk === "high")
    return "bg-red-50 text-red-700 dark:bg-red-900/30";
  if (risk === "medium")
    return "bg-amber-50 text-amber-700 dark:bg-amber-900/30";
  return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30";
}

export default function VaultPage() {
  const [cases, setCases] = useState<VaultDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.vaultPending();
      if (!cancelled) setCases(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load vault");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Vault"
        subtitle="Encrypted credentials · Admin-only · Every open is audit-logged"
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <div className="rounded-2xl border-2 border-red-300 bg-white p-4 dark:border-red-800 dark:bg-[#112240]">
        <p className="text-xs font-bold text-red-700 dark:text-red-400">
          🔐 AES-256 private vault · Raw Fayda / degree / selfie never shown on public profiles
        </p>
        <p className="mt-1 text-[11px] text-red-600/80 dark:text-red-500">
          Access is restricted to authorized verification officers. Opens write to admin_audit_logs
          (HMAC chain).
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {loading ? (
          <div className="lg:col-span-3 px-4 py-8 text-center text-sm text-slate-500">Loading vault…</div>
        ) : cases.length === 0 ? (
          <div className="lg:col-span-3 px-4 py-8 text-center text-sm text-slate-500">No pending vault items.</div>
        ) : (
          cases.map((row) => (
            <div
              key={row.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {row.user?.fullName || row.teacherId}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {row.adminNote ? `Note: ${row.adminNote}` : "No admin note"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${riskClass(row.status === "PENDING" ? "medium" : row.status === "REJECTED" ? "high" : "low")}`}
                >
                  {row.status.toLowerCase()}
                </span>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div
                  className={`rounded-xl border-2 p-2 text-center ${
                    row.status === "VERIFIED"
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                      : row.status === "REJECTED"
                        ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                        : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
                  }`}
                >
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                    {row.documentType.replace(/_/g, " ")}
                  </p>
                  <p
                    className={`text-[10px] font-semibold ${
                      row.status === "VERIFIED"
                        ? "text-emerald-600"
                        : row.status === "REJECTED"
                          ? "text-red-600"
                          : "text-amber-600"
                    }`}
                  >
                    {row.status === "VERIFIED" ? "✓ " : row.status === "REJECTED" ? "✗ " : "⏳ "}
                    {row.status.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
              <Link
                href={`/verification/${row.teacherId}`}
                className="block rounded-xl bg-slate-900 py-2.5 text-center text-xs font-bold text-white dark:bg-teal-600"
              >
                Open vault case
              </Link>
            </div>
          ))
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
        <h3 className="mb-3 font-bold text-slate-900 dark:text-white">Vault access log</h3>
        <div className="space-y-2 font-mono text-[11px]">
          {[
            { time: "11:42:03", admin: "admin@tbb.et", target: "Tadesse Alemu · Fayda ID", hash: "a3f8c2…" },
            { time: "10:15:22", admin: "admin@tbb.et", target: "Bereket Solomon · Degree", hash: "b7d1e9…" },
            { time: "09:01:11", admin: "system", target: "Integrity scan · vault_documents", hash: "c2a4f7…" },
          ].map((log, i) => (
            <div
              key={i}
              className="flex flex-wrap gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50"
            >
              <span className="text-slate-400">{log.hash}</span>
              <span className="text-teal-600">[{log.time}]</span>
              <span className="text-blue-600 dark:text-blue-400">{log.admin}</span>
              <span className="text-slate-600 dark:text-slate-400">{log.target}</span>
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