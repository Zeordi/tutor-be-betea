"use client";

export default function SafetyCenterPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="mb-2 text-2xl font-black text-[var(--foreground)]">Safety Center</h1>
      <p className="mb-8 text-sm text-[var(--secondary)]">
        Disputes, replacements, and trust tools
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          ["🛡️", "No active flags", "All tutors safe", "bg-teal-50 text-teal-700 dark:bg-teal-950/30"],
          ["📋", "1 open dispute", "DSP-2026-0841", "bg-amber-50 text-amber-800 dark:bg-amber-950/30"],
          ["🔄", "0 replacements", "All sessions fine", "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/30"],
        ].map(([icon, title, sub, cls]) => (
          <div key={title} className={`rounded-2xl border border-[var(--border)] p-5 ${cls}`}>
            <div className="mb-2 text-2xl">{icon}</div>
            <p className="font-extrabold">{title}</p>
            <p className="text-xs opacity-80">{sub}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="mb-4 font-extrabold text-[var(--foreground)]">Open dispute</p>
          {[
            ["Case ID", "DSP-2026-0841"],
            ["Issue", "Tutor No-Show"],
            ["Filed", "Aug 18, 2026"],
            ["Escrow", "Frozen · 450 ETB"],
            ["Status", "Under Review"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between border-b border-[var(--border)] py-2 text-sm"
            >
              <span className="text-[var(--secondary)]">{k}</span>
              <span className="font-bold text-[var(--foreground)]">{v}</span>
            </div>
          ))}
          <button
            type="button"
            className="mt-4 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-white"
          >
            View case details
          </button>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="mb-3 font-extrabold text-[var(--foreground)]">Request replacement</p>
          <p className="mb-5 text-sm leading-relaxed text-[var(--secondary)]">
            Not satisfied? We replace the tutor for free within 24 hours. Escrow carries over
            automatically.
          </p>
          <button
            type="button"
            className="w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm font-bold text-white"
          >
            🔄 Request replacement tutor
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="mb-4 font-extrabold text-[var(--foreground)]">Report a new problem</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["🚫", "No-Show", "Tutor didn't attend"],
            ["⚠️", "Safety concern", "Unsafe behaviour"],
            ["💳", "Billing issue", "Payment problem"],
          ].map(([icon, title, desc]) => (
            <button
              key={title}
              type="button"
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-5 text-center"
            >
              <div className="mb-2 text-2xl">{icon}</div>
              <p className="text-sm font-bold text-[var(--foreground)]">{title}</p>
              <p className="text-xs text-[var(--secondary)]">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}