"use client";

const FLAGS = [
  { user: "Kedir Abebe", role: "Tutor", severity: "High", reason: "No-show pattern", action: "Suspend" },
  { user: "Unknown Device", role: "Parent", severity: "Medium", reason: "Multi-account signal", action: "Review" },
  { user: "Test Tutor", role: "Tutor", severity: "Low", reason: "Chat contact attempt", action: "Warn" },
];

export default function RiskFlagsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black">Risk Flagging Queue</h1>
      <div className="space-y-3">
        {FLAGS.map((f) => (
          <div
            key={f.user}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
          >
            <div>
              <p className="font-bold">{f.user}</p>
              <p className="text-sm text-[var(--secondary)]">
                {f.role} · {f.reason}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                  f.severity === "High"
                    ? "bg-red-50 text-red-600"
                    : f.severity === "Medium"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-[var(--muted)] text-[var(--secondary)]"
                }`}
              >
                {f.severity}
              </span>
              <button type="button" className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white">
                {f.action}
              </button>
              <button type="button" className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-bold">
                Clear
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}