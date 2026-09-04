"use client";

const DOCS = [
  {
    name: "National ID",
    status: "rejected",
    note: "Image blurry. Please re-upload a clear, unobstructed scan. Minimum 300 DPI.",
    icon: "🪪",
  },
  {
    name: "Degree Certificate",
    status: "needs_info",
    note: "Certificate must show university seal, signature, and full name. Partial scan submitted.",
    icon: "🎓",
  },
  {
    name: "Police Clearance",
    status: "approved",
    note: "Approved on Aug 20, 2026. Valid for 12 months.",
    icon: "👮",
  },
];

function statusMeta(status: string) {
  if (status === "rejected")
    return {
      label: "Rejected",
      chip: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300",
      border: "border-red-300 dark:border-red-800",
    };
  if (status === "needs_info")
    return {
      label: "Needs More Info",
      chip: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
      border: "border-amber-300 dark:border-amber-800",
    };
  return {
    label: "Approved",
    chip: "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40",
    border: "border-[var(--border)]",
  };
}

export default function TeacherVerificationPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-black text-[var(--foreground)]">
        Document Verification
      </h1>
      <p className="mb-6 text-sm text-[var(--secondary)]">
        AES-256 vault · admin-only access · public profiles show Trust Badges only
      </p>

      <div className="mb-6 flex gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
        <span className="text-3xl">⚠️</span>
        <div>
          <p className="font-extrabold text-red-700 dark:text-red-300">
            Action required: 2 documents need attention
          </p>
          <p className="mt-1 text-sm text-red-600/90 dark:text-red-200/80">
            Re-upload the flagged documents. Your profile goes live within 48 hours of
            re-submission approval.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {DOCS.map((doc) => {
          const st = statusMeta(doc.status);
          const needsAction = doc.status !== "approved";
          return (
            <div
              key={doc.name}
              className={`overflow-hidden rounded-2xl border-2 bg-[var(--card)] ${st.border}`}
            >
              <div className="flex items-center gap-4 border-b border-[var(--border)] px-5 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--muted)] text-2xl">
                  {doc.icon}
                </div>
                <div className="flex-1">
                  <p className="font-extrabold text-[var(--foreground)]">{doc.name}</p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${st.chip}`}>
                    {st.label}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div
                  className={`mb-4 rounded-xl p-4 ${
                    needsAction
                      ? "bg-[var(--muted)]"
                      : "border border-[var(--border)] bg-[var(--muted)]"
                  }`}
                >
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[var(--secondary)]">
                    Admin review note
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--foreground)]">
                    {doc.note}
                  </p>
                </div>

                {needsAction && (
                  <>
                    <div className="mb-3 grid gap-3 sm:grid-cols-2">
                      {["📷 Take Photo", "📁 Browse Files"].map((label) => (
                        <button
                          key={label}
                          type="button"
                          className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)] px-4 py-5 text-center transition hover:border-[var(--primary)]"
                        >
                          <p className="text-2xl">{label.slice(0, 2)}</p>
                          <p className="mt-1 text-sm font-bold text-[var(--foreground)]">
                            {label.slice(3)}
                          </p>
                          <p className="text-[11px] text-[var(--secondary)]">
                            JPG, PNG, PDF · max 5MB
                          </p>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white"
                    >
                      Re-Submit {doc.name}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}