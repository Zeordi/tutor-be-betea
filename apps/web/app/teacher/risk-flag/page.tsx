"use client";

import Link from "next/link";
import { useState } from "react";

export default function TeacherRiskFlagPage() {
  const [appealStarted, setAppealStarted] = useState(false);
  const [appealText, setAppealText] = useState("");

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 font-black text-white">
          ⚑
        </div>
        <div>
          <p className="font-extrabold text-red-700 dark:text-red-300">Risk Flag — Account Restricted</p>
          <p className="text-xs text-red-500">Issued Oct 11, 2024 · Case #RF-00283</p>
        </div>
      </div>

      <div className="rounded-2xl bg-red-600 p-6 text-white">
        <p className="text-lg font-extrabold">Your account has been flagged</p>
        <p className="mt-2 text-sm text-white/90">
          A safety concern was reported by a parent following a session on October 10. While we
          investigate, some features have been temporarily restricted. Your earnings are safe.
        </p>
        <p className="mt-2 text-xs text-white/70">ሒሳብዎ ለደህንነት ምርምር ተቋርጧል — ክፍያዎ ሳይነካ ይቆያል</p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] border-l-4 border-l-red-500 bg-[var(--card)] p-5">
        <p className="mb-1 text-[10px] font-bold tracking-wide text-red-500">FLAG REASON</p>
        <p className="font-bold text-[var(--foreground)]">Potential Communication Policy Violation</p>
        <p className="mt-2 text-sm text-[var(--secondary)]">
          A parent reported that off-platform contact was attempted during a session. This violates
          TBB&apos;s anti-poaching and safety policy.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">ACTIVE RESTRICTIONS</p>
        {[
          ["🔍", "Job Applications Suspended", "Cannot apply for new contracts during review"],
          ["📣", "Profile Hidden from Search", "Existing students still have access"],
          ["💬", "Chat Rate-Limited", "Message volume restricted to existing contracts only"],
        ].map(([icon, title, desc]) => (
          <div
            key={title}
            className="mb-2 flex gap-3 rounded-xl border border-red-100 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30"
          >
            <span className="text-lg">{icon}</span>
            <div>
              <p className="text-sm font-bold text-red-700 dark:text-red-300">{title}</p>
              <p className="text-xs text-red-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">REVIEW TIMELINE</p>
        {[
          { date: "Oct 11", event: "Flag raised · Account restricted", done: true, current: false },
          { date: "Oct 12", event: "Safety Team begins review (in progress)", done: false, current: true },
          { date: "Oct 14", event: "Initial ruling issued", done: false, current: false },
          { date: "Oct 16", event: "Appeal deadline if ruling is unfavorable", done: false, current: false },
        ].map((t) => (
          <div key={t.date} className="mb-3 flex gap-3">
            <div
              className={`mt-1.5 h-2 w-2 rounded-full ${
                t.done ? "bg-emerald-500" : t.current ? "bg-amber-500" : "bg-slate-300"
              }`}
            />
            <div>
              <p className={`text-[10px] font-bold ${t.current ? "text-amber-600" : "text-[var(--secondary)]"}`}>
                {t.date}
              </p>
              <p className="text-sm text-[var(--foreground)]">{t.event}</p>
            </div>
          </div>
        ))}
      </div>

      {!appealStarted ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
          <p className="font-bold text-blue-800 dark:text-blue-300">Believe this is a mistake?</p>
          <p className="my-2 text-sm text-blue-700 dark:text-blue-400">
            Submit an appeal with your account of events. Reviews within 48 hours.
          </p>
          <button
            type="button"
            onClick={() => setAppealStarted(true)}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white"
          >
            Submit an Appeal
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
          <p className="font-bold text-blue-800 dark:text-blue-300">✍ Your Account of Events</p>
          <textarea
            value={appealText}
            onChange={(e) => setAppealText(e.target.value)}
            placeholder="Describe what happened..."
            rows={4}
            className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)]"
          />
          <button
            type="button"
            className="mt-3 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white"
          >
            📤 Submit Appeal
          </button>
        </div>
      )}

      <Link
        href="/parent/support/create"
        className="block rounded-xl border border-[var(--border)] py-3 text-center text-sm font-bold text-[var(--secondary)]"
      >
        📞 Contact Safety Team
      </Link>
    </div>
  );
}