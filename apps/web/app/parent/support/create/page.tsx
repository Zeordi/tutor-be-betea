"use client";

import Link from "next/link";
import { useState } from "react";

const ISSUE_TYPES = [
  { id: "no-show", icon: "🚫", label: "Tutor No-Show", desc: "Tutor didn’t arrive for session" },
  { id: "late", icon: "⏰", label: "Consistently Late", desc: "Arrived 30+ min late multiple times" },
  { id: "quality", icon: "📉", label: "Poor Quality", desc: "Teaching not matching promises" },
  { id: "escrow", icon: "💰", label: "Payment Dispute", desc: "Milestone issue or unauthorized charge" },
  { id: "behavior", icon: "⚠️", label: "Inappropriate Behavior", desc: "Conduct or safety concern" },
  { id: "other", icon: "🔧", label: "Other Issue", desc: "Something not listed above" },
];

export default function ReportProblemWebPage() {
  const [step, setStep] = useState(1);
  const [issueType, setIssueType] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Report a Problem</h1>
          <p className="text-sm text-[var(--secondary)]">Step {step}/3</p>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 w-10 rounded-full ${s <= step ? "bg-[var(--primary)]" : "bg-[var(--muted)]"}`}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <>
          <p className="text-lg font-extrabold text-[var(--foreground)]">What’s the issue?</p>
          <div className="space-y-2">
            {ISSUE_TYPES.map((t) => {
              const selected = issueType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setIssueType(t.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
                    selected
                      ? "border-[var(--primary)] bg-[var(--primary)]/5"
                      : "border-[var(--border)] bg-[var(--card)]"
                  }`}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[var(--foreground)]">{t.label}</p>
                    <p className="text-xs text-[var(--secondary)]">{t.desc}</p>
                  </div>
                  {selected && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-extrabold text-white">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            disabled={!issueType}
            onClick={() => setStep(2)}
            className="w-full rounded-2xl bg-[var(--primary)] py-3.5 text-sm font-extrabold text-white disabled:opacity-40"
          >
            Continue →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p className="text-lg font-extrabold text-[var(--foreground)]">Details & Evidence</p>
          <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-center gap-3 rounded-xl bg-[var(--muted)] p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] font-bold text-white">
                H
              </div>
              <p className="text-sm font-bold text-[var(--foreground)]">Hana Bekele · Mathematics</p>
            </div>
            <label className="block text-xs font-semibold text-[var(--secondary)]">
              Description *
              <textarea
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] p-3 text-sm text-[var(--foreground)]"
                rows={4}
                defaultValue="Tutor arrived 45 minutes late without advance notice."
              />
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["📷 Camera", "🖼 Gallery", "📄 File"].map((l) => (
                <button
                  key={l}
                  type="button"
                  className="rounded-xl border border-dashed border-[var(--border)] py-3 text-xs font-semibold text-[var(--secondary)]"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStep(3)}
            className="w-full rounded-2xl bg-[var(--primary)] py-3.5 text-sm font-extrabold text-white"
          >
            Submit Report →
          </button>
        </>
      )}

      {step === 3 && (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-4xl dark:bg-emerald-900/40">
            ✅
          </div>
          <h2 className="text-xl font-extrabold text-[var(--foreground)]">Report Submitted</h2>
          <p className="text-sm text-[var(--secondary)]">
            Our Safety Team will review within 24 hours. Case <strong>#TBB-28471</strong>
          </p>
          <p className="text-xs text-[var(--primary)]">ጉዳዩ ለደህንነት ቡድናችን ደርሷል</p>
          <div className="flex gap-3">
            <Link
              href="/parent"
              className="flex-1 rounded-xl border border-[var(--border)] py-3 text-sm font-bold text-[var(--secondary)]"
            >
              Back to Home
            </Link>
            <Link
              href="/parent/safety"
              className="flex-1 rounded-xl bg-[var(--primary)] py-3 text-sm font-extrabold text-white"
            >
              Track Case
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}