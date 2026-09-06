"use client";

import { useState } from "react";

type Flag = {
  id: string;
  user: string;
  role: string;
  severity: "High" | "Medium" | "Low";
  reason: string;
  detail: string;
  when: string;
};

const INITIAL: Flag[] = [
  {
    id: "RF-01",
    user: "Kedir Abebe",
    role: "Tutor",
    severity: "High",
    reason: "No-show pattern",
    detail: "3 incomplete sessions in 14 days without geofence check-in.",
    when: "2h ago",
  },
  {
    id: "RF-02",
    user: "Unknown Device · Parent",
    role: "Parent",
    severity: "Medium",
    reason: "Multi-account signal",
    detail: "Same device fingerprint linked to 3 parent accounts.",
    when: "5h ago",
  },
  {
    id: "RF-03",
    user: "Test Tutor",
    role: "Tutor",
    severity: "Low",
    reason: "Chat contact attempt",
    detail: "Message contained phone pattern — auto-redacted.",
    when: "1d ago",
  },
];

export default function RiskFlagsPage() {
  const [flags, setFlags] = useState(INITIAL);

  const clear = (id: string) => setFlags((prev) => prev.filter((f) => f.id !== id));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">
            Risk Flagging Queue
          </h1>
          <p className="text-sm text-[var(--secondary)]">
            {flags.length} open · severity-ranked
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {(["High", "Medium", "Low"] as const).map((s) => (
          <div
            key={s}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <p className="text-xl font-black text-[var(--foreground)]">
              {flags.filter((f) => f.severity === s).length}
            </p>
            <p className="text-xs text-[var(--secondary)]">{s} severity</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {flags.map((f) => (
          <div
            key={f.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <p className="font-bold text-[var(--foreground)]">{f.user}</p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      f.severity === "High"
                        ? "bg-red-50 text-red-600 dark:bg-red-950/40"
                        : f.severity === "Medium"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40"
                          : "bg-[var(--muted)] text-[var(--secondary)]"
                    }`}
                  >
                    {f.severity}
                  </span>
                  <span className="text-xs text-[var(--secondary)]">{f.when}</span>
                </div>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {f.role} · {f.reason}
                </p>
                <p className="mt-1 text-sm text-[var(--secondary)]">{f.detail}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white"
                >
                  Suspend
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-bold"
                >
                  Warn
                </button>
                <button
                  type="button"
                  onClick={() => clear(f.id)}
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-bold text-[var(--primary)]"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        ))}
        {flags.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--secondary)]">
            Queue empty — no open risk flags.
          </div>
        )}
      </div>
    </div>
  );
}