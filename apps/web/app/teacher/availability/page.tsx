"use client";

import { useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["9AM", "10AM", "11AM", "2PM", "3PM", "4PM"];

export default function TeacherAvailabilityPage() {
  const [tab, setTab] = useState<"weekly" | "packages">("weekly");
  const [slots, setSlots] = useState<Record<string, boolean>>({
    "Mon-10AM": true,
    "Mon-2PM": true,
    "Wed-10AM": true,
    "Wed-3PM": true,
    "Fri-9AM": true,
  });

  const toggle = (key: string) =>
    setSlots((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div>
      <h1 className="mb-2 text-2xl font-black text-[var(--foreground)]">
        Availability & Packages
      </h1>
      <p className="mb-6 text-sm text-[var(--secondary)]">
        Weekly slots parents can book · package offers
      </p>

      <div className="mb-6 flex gap-2">
        {(["weekly", "packages"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-2 text-sm font-bold capitalize ${
              tab === t
                ? "border-[var(--primary)] bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40"
                : "border-[var(--border)] text-[var(--secondary)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "weekly" && (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="grid min-w-[560px] grid-cols-8 gap-2">
            <div />
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-bold text-[var(--secondary)]"
              >
                {d}
              </div>
            ))}
            {HOURS.map((h) => (
              <>
                <div
                  key={`h-${h}`}
                  className="flex items-center text-xs font-semibold text-[var(--secondary)]"
                >
                  {h}
                </div>
                {DAYS.map((d) => {
                  const key = `\( {d}- \){h}`;
                  const on = !!slots[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggle(key)}
                      className={`rounded-lg py-2 text-[10px] font-bold ${
                        on
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--muted)] text-[var(--secondary)]"
                      }`}
                    >
                      {on ? "Open" : "—"}
                    </button>
                  );
                })}
              </>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--secondary)]">
            Tip: block vacation dates from Settings · changes sync to parent booking.
          </p>
        </div>
      )}

      {tab === "packages" && (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { name: "Standard", hrs: "8 hrs", price: "3,200 ETB", active: true },
            { name: "Intensive", hrs: "16 hrs", price: "5,800 ETB", active: true },
            { name: "Weekend", hrs: "6 hrs", price: "2,700 ETB", active: false },
          ].map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
            >
              <p className="text-lg font-black text-[var(--foreground)]">{p.name}</p>
              <p className="text-sm text-[var(--secondary)]">{p.hrs}</p>
              <p className="mt-2 font-mono text-xl font-black text-[var(--primary)]">
                {p.price}
              </p>
              <span
                className={`mt-3 inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
                  p.active
                    ? "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40"
                    : "bg-[var(--muted)] text-[var(--secondary)]"
                }`}
              >
                {p.active ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}