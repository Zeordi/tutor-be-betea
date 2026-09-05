"use client";

import Link from "next/link";
import { useState } from "react";

const CATEGORIES = [
  { icon: "📅", label: "Booking", count: 12 },
  { icon: "💰", label: "Payments", count: 8 },
  { icon: "🛡️", label: "Safety", count: 6 },
  { icon: "📊", label: "Reports", count: 5 },
  { icon: "👤", label: "Account", count: 9 },
  { icon: "🔗", label: "Contracts", count: 7 },
];

const FAQS = [
  {
    q: "How does the escrow payment work?",
    a: "Your payment is held securely by Tutor Be Betea. It is released to the tutor only after each milestone is completed and you approve it.",
  },
  {
    q: "How are tutors verified?",
    a: "Every tutor undergoes Fayda National ID verification, university degree board checks, and background screening. Only verified tutors receive Trust Badges.",
  },
  {
    q: "Can I request a tutor replacement?",
    a: "Yes. After 2 sessions, you can request a free replacement from the Safety Center. Premium and Elite plans include guaranteed replacements.",
  },
  {
    q: "What if a session doesn’t happen?",
    a: "If a tutor cancels or no-shows, you receive a full escrow refund for that session plus a free session credit.",
  },
];

export default function ParentHelpPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Help Center</h1>
        <p className="text-sm text-[var(--secondary)]">Search articles or browse by topic</p>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
        <span>🔍</span>
        <span className="text-sm text-[var(--secondary)]">Search help articles, FAQs…</span>
      </div>

      <div>
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">BROWSE BY TOPIC</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center"
            >
              <p className="text-2xl">{c.icon}</p>
              <p className="mt-2 text-sm font-bold text-[var(--foreground)]">{c.label}</p>
              <p className="text-xs text-[var(--secondary)]">{c.count} articles</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">FREQUENTLY ASKED</p>
        {FAQS.map((f, i) => (
          <div key={f.q} className="border-b border-[var(--border)] last:border-0">
            <button
              type="button"
              className="flex w-full items-center gap-2 py-3 text-left"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <span className="flex-1 text-sm font-semibold text-[var(--foreground)]">{f.q}</span>
              <span className="text-[var(--secondary)]">{expanded === i ? "▴" : "▾"}</span>
            </button>
            {expanded === i && (
              <p className="pb-3 text-sm leading-relaxed text-[var(--secondary)]">{f.a}</p>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-800 dark:bg-teal-950/40">
        <p className="font-extrabold text-teal-800 dark:text-teal-300">Still need help?</p>
        <p className="my-2 text-sm text-teal-700 dark:text-teal-400">
          Support team available 8AM–10PM Addis Ababa time · ድጋፍ ቡድን
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/parent/support/create"
            className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-bold text-white"
          >
            💬 Live Chat / Report
          </Link>
        </div>
      </div>
    </div>
  );
}