"use client";

import { useState } from "react";

const SCHEDULE = [
  { day: "Mon", slots: ["09:00–11:00", "16:00–19:00"] },
  { day: "Tue", slots: ["14:00–18:00"] },
  { day: "Wed", slots: [] as string[] },
  { day: "Thu", slots: ["09:00–11:00", "16:00–19:00"] },
  { day: "Fri", slots: ["16:00–20:00"] },
  { day: "Sat", slots: ["09:00–13:00", "14:00–17:00"] },
  { day: "Sun", slots: [] as string[] },
];

const PACKAGES = [
  { name: "Standard", sessions: 8, hrs: 1, total: 3600, popular: false },
  { name: "Intensive", sessions: 12, hrs: 1.5, total: 8100, popular: true },
  { name: "Weekend Boost", sessions: 6, hrs: 2, total: 5040, popular: false },
];

export default function TeacherAvailabilityPage() {
  const [tab, setTab] = useState<"weekly" | "packages">("weekly");

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
            Availability & Packages
          </h1>
          <p className="text-sm text-[var(--secondary)]">
            Weekly hours parents can book · package offers
          </p>
        </div>
        <button
          type="button"
          className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
        >
          Save
        </button>
      </div>

      <div className="flex border-b border-[var(--border)]">
        {([
          ["weekly", "📅 Weekly Hours"],
          ["packages", "📦 Packages"],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`relative flex-1 py-3 text-sm font-bold ${
              tab === id ? "text-[var(--primary)]" : "text-[var(--secondary)]"
            }`}
          >
            {label}
            {tab === id && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-[var(--primary)]" />
            )}
          </button>
        ))}
      </div>

      {tab === "weekly" ? (
        <>
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
            ⏱ Weekly capacity: <strong>22 hrs</strong> · Max recommended: 30 hrs/week
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">
              RECURRING SCHEDULE
            </p>
            <div className="space-y-3">
              {SCHEDULE.map((d) => (
                <div
                  key={d.day}
                  className="flex flex-wrap items-start gap-3 border-b border-[var(--border)] pb-3 last:border-0"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-extrabold ${
                      d.slots.length
                        ? "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40"
                        : "bg-[var(--muted)] text-[var(--secondary)]"
                    }`}
                  >
                    {d.day}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    {d.slots.length > 0 ? (
                      <>
                        {d.slots.map((s) => (
                          <span
                            key={s}
                            className="rounded-lg border border-teal-200 bg-teal-50 px-2 py-1 text-xs font-semibold text-[var(--primary)] dark:border-teal-800 dark:bg-teal-950/40"
                          >
                            {s}
                          </span>
                        ))}
                        <button type="button" className="text-xs font-bold text-[var(--primary)]">
                          + Add
                        </button>
                      </>
                    ) : (
                      <button type="button" className="text-xs text-[var(--secondary)]">
                        + Add slots
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold tracking-wide text-[var(--secondary)]">
                BLOCK DATES
              </p>
              <button type="button" className="text-xs font-bold text-[var(--primary)]">
                + Block
              </button>
            </div>
            {[
              ["Oct 20–22", "University exam period"],
              ["Nov 5", "Family event — Meskel celebration"],
            ].map(([d, r]) => (
              <div key={d} className="mb-2 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-[var(--foreground)]">{d}</p>
                  <p className="text-xs text-[var(--secondary)]">{r}</p>
                </div>
                <span className="text-[var(--secondary)]">🗑</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {PACKAGES.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border bg-[var(--card)] p-5 ${
                p.popular ? "border-2 border-[var(--primary)]" : "border-[var(--border)]"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-lg font-extrabold text-[var(--foreground)]">{p.name}</p>
                {p.popular && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    Popular
                  </span>
                )}
              </div>
              <div className="mb-3 grid grid-cols-3 gap-2">
                {[
                  [`${p.sessions}`, "Sessions"],
                  [`${p.hrs}h`, "Per session"],
                  [p.total.toLocaleString(), "ETB total"],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-xl bg-[var(--muted)] p-3 text-center">
                    <p className="text-sm font-extrabold text-[var(--foreground)]">{v}</p>
                    <p className="text-[10px] text-[var(--secondary)]">{l}</p>
                  </div>
                ))}
              </div>
              <p className="mb-3 text-[10px] text-[var(--secondary)]">
                ✅ Valid 60 days · Escrow per session · Telebirr / CBE Birr
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-[var(--border)] py-2.5 text-xs font-bold text-[var(--secondary)]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-xl py-2.5 text-xs font-bold ${
                    p.popular
                      ? "bg-[var(--primary)] text-white"
                      : "border border-[var(--border)] text-[var(--secondary)]"
                  }`}
                >
                  {p.popular ? "Active ✓" : "Activate"}
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="w-full rounded-2xl border-2 border-dashed border-[var(--border)] py-4 text-sm font-bold text-[var(--secondary)]"
          >
            + Create Custom Package
          </button>
        </>
      )}
    </div>
  );
}