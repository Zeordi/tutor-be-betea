"use client";

const PROMOS = [
  { code: "TBBNEW20", use: 128, max: 500, status: "live" },
  { code: "TUTOR100", use: 45, max: 200, status: "live" },
  { code: "SUMMER50", use: 200, max: 200, status: "ended" },
];

export default function PromosPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black">Promo & Banner Manager</h1>
        <button type="button" className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white">
          + New promo
        </button>
      </div>
      <div className="space-y-3">
        {PROMOS.map((p) => (
          <div
            key={p.code}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
          >
            <div className="mb-2 flex justify-between">
              <p className="font-mono text-lg font-black text-[var(--primary)]">{p.code}</p>
              <span className="text-xs font-bold capitalize text-[var(--secondary)]">
                {p.status}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
              <div
                className="h-full bg-[var(--primary)]"
                style={{ width: `${(p.use / p.max) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-[var(--secondary)]">
              {p.use} / {p.max} uses
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}