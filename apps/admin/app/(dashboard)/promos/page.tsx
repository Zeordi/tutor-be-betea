"use client";

const PROMOS = [
  { code: "TBBNEW20", label: "New parent 20% off first package", use: 128, max: 500, status: "live" },
  { code: "TUTOR100", label: "Tutor referral 100 ETB", use: 45, max: 200, status: "live" },
  { code: "SUMMER50", label: "Summer campaign", use: 200, max: 200, status: "ended" },
];

const BANNERS = [
  { title: "Fayda verified tutors", place: "Landing hero", status: "live" },
  { title: "Refer & earn ETB", place: "Parent home", status: "live" },
  { title: "Connects top-up", place: "Teacher jobs", status: "draft" },
];

export default function PromosPage() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">
            Promo & Banner Manager
          </h1>
          <p className="text-sm text-[var(--secondary)]">Usage caps · campaign placement</p>
        </div>
        <button
          type="button"
          className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
        >
          + New promo
        </button>
      </div>

      <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-[var(--secondary)]">
        Promo codes
      </h2>
      <div className="mb-8 space-y-3">
        {PROMOS.map((p) => {
          const pct = Math.round((p.use / p.max) * 100);
          return (
            <div
              key={p.code}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-lg font-black text-[var(--primary)]">
                    {p.code}
                  </p>
                  <p className="text-sm text-[var(--secondary)]">{p.label}</p>
                </div>
                <span className="text-xs font-bold capitalize text-[var(--secondary)]">
                  {p.status}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-[var(--secondary)]">
                {p.use} / {p.max} uses · {pct}%
              </p>
            </div>
          );
        })}
      </div>

      <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-[var(--secondary)]">
        Banners
      </h2>
      <div className="grid gap-3 md:grid-cols-3">
        {BANNERS.map((b) => (
          <div
            key={b.title}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
          >
            <p className="font-bold text-[var(--foreground)]">{b.title}</p>
            <p className="mt-1 text-xs text-[var(--secondary)]">{b.place}</p>
            <span
              className={`mt-3 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${
                b.status === "live"
                  ? "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40"
                  : "bg-[var(--muted)] text-[var(--secondary)]"
              }`}
            >
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}