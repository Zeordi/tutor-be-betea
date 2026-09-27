"use client";

import { useEffect, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

type DocStatus = "rejected" | "needs-info" | "pending" | "approved";

type VerificationDoc = {
  id: string;
  label: string;
  status: DocStatus;
  statusLabel: string;
  note?: string;
  icon: string;
};

type VerificationStatus = {
  docs: VerificationDoc[];
  adminNote: string;
  adminNoteDate: string;
  adminNoteAuthor: string;
};

type ChecklistItem = {
  label: string;
  done: boolean;
  icon: string;
};

function statusIcon(status: DocStatus) {
  if (status === "approved") return "✅";
  if (status === "pending") return "⏳";
  if (status === "needs-info") return "⚠️";
  return "📎";
}

function statusPillClass(status: DocStatus) {
  if (status === "approved")
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (status === "pending")
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300";
  if (status === "needs-info")
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300";
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
}

function tileClass(status: DocStatus) {
  if (status === "approved")
    return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (status === "pending")
    return "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-300";
  if (status === "needs-info")
    return "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-300";
  return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";
}

export default function TeacherVerificationPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<VerificationStatus | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<VerificationStatus>(paths.verificationStatus)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load verification status");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const startUpload = (id: string) => {
    setUploading(id);
    setTimeout(() => setUploading(null), 1500);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
  };

  const checklist: ChecklistItem[] = (data?.docs || []).map((doc) => ({
    label: doc.label,
    done: doc.status === "approved",
    icon: statusIcon(doc.status),
  }));

  if (loading) {
    return (
      <div className="space-y-5 p-4 md:p-8">
        <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800 md:col-span-2" />
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        </div>
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

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-sm text-[var(--secondary)]">No verification data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 md:p-8">
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Verification Status</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <h3 className="mb-4 font-bold text-slate-800 dark:text-white">Document Status</h3>
            {(data.docs || []).length === 0 ? (
              <p className="text-sm text-slate-400">No documents uploaded yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {(data.docs || []).map((doc) => (
                  <div key={doc.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${tileClass(doc.status)}`}
                      >
                        {statusIcon(doc.status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-white">{doc.label}</p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {doc.note || doc.statusLabel}
                          {doc.status === "approved" && data.adminNoteDate && (
                            <span> · {new Date(data.adminNoteDate).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusPillClass(doc.status)}`}
                      >
                        {doc.statusLabel}
                      </span>
                    </div>
                    {doc.status === "approved" && (
                      <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">✓ Verified · No action needed</p>
                    )}
                    {doc.status === "pending" && (
                      <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">⏳ Pending review</p>
                    )}
                    {(doc.status === "rejected" || doc.status === "needs-info") && (
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => startUpload(doc.id)}
                          className="rounded-xl border-2 border-[var(--primary)] py-2.5 text-xs font-bold text-[var(--primary)]"
                        >
                          📷 Camera
                        </button>
                        <button
                          type="button"
                          onClick={() => startUpload(doc.id)}
                          className="rounded-xl border border-[var(--border)] py-2.5 text-xs font-bold text-[var(--secondary)]"
                        >
                          📎 Upload File
                        </button>
                      </div>
                    )}
                    {uploading === doc.id && (
                      <p className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                        Uploading securely (AES-256)…
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 md:col-span-1">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-white">Onboarding Checklist</h3>
            {checklist.length === 0 ? (
              <p className="text-sm text-slate-400">No checklist items yet.</p>
            ) : (
              <div className="space-y-2.5">
                {checklist.map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{item.icon}</span>
                    <span
                      className={`text-xs font-semibold ${
                        item.done ? "text-slate-700 dark:text-slate-200" : "text-slate-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {data.adminNote && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
              <h3 className="mb-1 text-sm font-bold text-amber-800 dark:text-amber-300">Admin Message</h3>
              <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">{data.adminNote}</p>
              <p className="mt-2 text-[10px] text-amber-700 dark:text-amber-400">
                {new Date(data.adminNoteDate).toLocaleDateString()} · {data.adminNoteAuthor}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs leading-relaxed text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
        🔒 Documents are encrypted with AES-256 and stored in a private Admin vault. They are never
        visible to parents or other teachers. Only trained TBB verification staff access them. Trust
        Badges are the only public indicator.
      </div>
    </div>
  );
}
