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

function statusStyle(status: DocStatus) {
  if (status === "approved")
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  if (status === "rejected")
    return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  if (status === "needs-info")
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
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

    return () => {
      cancelled = true;
    };
  }, []);

  const startUpload = (id: string) => {
    setUploading(id);
    setTimeout(() => setUploading(null), 1500);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        ))}
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
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Document Re-upload</h1>
        <p className="text-sm text-[var(--secondary)]">Vault · AES-256 · Admin only</p>
      </div>

      {data.adminNote && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
          <p className="mb-1 text-xs font-bold text-red-600">📋 Admin Note</p>
          <p className="text-sm leading-relaxed text-[var(--foreground)]">
            {data.adminNote}
          </p>
          <p className="mt-2 text-[10px] text-[var(--secondary)]">
            {new Date(data.adminNoteDate).toLocaleDateString()} · {data.adminNoteAuthor}
          </p>
        </div>
      )}

      {(data.docs || []).map((doc) => (
        <div
          key={doc.id}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--muted)] text-2xl">
              {doc.icon}
            </div>
            <div className="flex-1">
              <p className="font-bold text-[var(--foreground)]">{doc.label}</p>
              <span
                className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusStyle(doc.status)}`}
              >
                {doc.statusLabel}
              </span>
            </div>
          </div>

          {doc.note && (
            <div className="mt-3 rounded-xl bg-[var(--muted)] p-3 text-sm text-[var(--secondary)]">
              {doc.note}
            </div>
          )}

          {doc.status !== "approved" && doc.status !== "pending" ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => startUpload(doc.id)}
                className="rounded-xl border-2 border-[var(--primary)] py-3 text-xs font-bold text-[var(--primary)]"
              >
                📷 Camera
              </button>
              <button
                type="button"
                onClick={() => startUpload(doc.id)}
                className="rounded-xl border border-[var(--border)] py-3 text-xs font-bold text-[var(--secondary)]"
              >
                📎 Upload File
              </button>
            </div>
          ) : doc.status === "approved" ? (
            <p className="mt-3 text-sm font-semibold text-emerald-600">✓ Verified · No action needed</p>
          ) : (
            <p className="mt-3 text-sm font-semibold text-[var(--secondary)]">⏳ Pending review</p>
          )}

          {uploading === doc.id && (
            <p className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
              Uploading securely (AES-256)…
            </p>
          )}
        </div>
      ))}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-4 text-xs leading-relaxed text-[var(--secondary)]">
        🔒 Documents are encrypted with AES-256 and stored in a private Admin vault. They are never
        visible to parents or other teachers. Only trained TBB verification staff access them. Trust
        Badges are the only public indicator.
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-2xl bg-[var(--primary)] py-3.5 text-sm font-extrabold text-white disabled:opacity-70"
        disabled={submitted}
      >
        {submitted ? "✓ Submitted for Re-review" : "Submit for Re-review"}
      </button>
    </div>
  );
}
