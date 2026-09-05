"use client";

import { useState } from "react";

type DocStatus = "rejected" | "needs-info" | "approved";

const DOCS: {
  id: string;
  label: string;
  status: DocStatus;
  statusLabel: string;
  note?: string;
  icon: string;
}[] = [
  {
    id: "national-id",
    label: "Fayda National ID",
    status: "rejected",
    statusLabel: "Rejected",
    note: "Front and back sides must be clearly visible. The uploaded image was too blurry. Please retake in good lighting.",
    icon: "🪪",
  },
  {
    id: "degree",
    label: "University Degree Certificate",
    status: "needs-info",
    statusLabel: "Needs More Info",
    note: "Please upload the official transcript alongside the certificate. The registrar stamp must be visible.",
    icon: "🎓",
  },
  {
    id: "liveness",
    label: "Biometric Liveness Selfie",
    status: "approved",
    statusLabel: "Approved",
    icon: "📸",
  },
];

function statusStyle(status: DocStatus) {
  if (status === "approved")
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  if (status === "rejected")
    return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
}

export default function TeacherVerificationPage() {
  const [uploading, setUploading] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const startUpload = (id: string) => {
    setUploading(id);
    setTimeout(() => setUploading(null), 1500);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Document Re-upload</h1>
        <p className="text-sm text-[var(--secondary)]">Vault · AES-256 · Admin only</p>
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
        <p className="mb-1 text-xs font-bold text-red-600">📋 Admin Note</p>
        <p className="text-sm leading-relaxed text-[var(--foreground)]">
          Dear Hana, thank you for registering. We could not verify your National ID because the
          image quality was insufficient. Please ensure both sides are photographed clearly in good
          lighting. Degree transcripts must include the registrar stamp. — TBB Verification Team
        </p>
        <p className="mt-2 text-[10px] text-[var(--secondary)]">Oct 9, 2024 · Verification Analyst</p>
      </div>

      {DOCS.map((doc) => (
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

          {doc.status !== "approved" ? (
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
          ) : (
            <p className="mt-3 text-sm font-semibold text-emerald-600">✓ Verified · No action needed</p>
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
        onClick={() => setSubmitted(true)}
        className="w-full rounded-2xl bg-[var(--primary)] py-3.5 text-sm font-extrabold text-white"
      >
        {submitted ? "✓ Submitted for Re-review" : "Submit for Re-review"}
      </button>
    </div>
  );
}