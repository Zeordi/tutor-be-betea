"use client";

import { useState } from "react";

const CASES = [
  {
    id: "DSP-2026-0841",
    type: "No-Show",
    parent: "Hana Mulugeta",
    tutor: "Kedir Abebe",
    amount: 450,
    status: "reviewing",
  },
  {
    id: "DSP-2026-0830",
    type: "Billing",
    parent: "Tigist Haile",
    tutor: "Dawit Girma",
    amount: 900,
    status: "pending",
  },
];

export default function DisputesPage() {
  const [active, setActive] = useState(0);
  const c = CASES[active];

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <p className="border-b border-[var(--border)] px-4 py-3 font-bold">
          Open Disputes ({CASES.length})
        </p>
        {CASES.map((ca, i) => (
          <button
            key={ca.id}
            type="button"
            onClick={() => setActive(i)}
            className={`w-full border-b border-[var(--border)] px-4 py-4 text-left ${
              active === i ? "bg-teal-50 dark:bg-teal-950/30" : ""
            }`}
          >
            <p className="font-bold">{ca.id}</p>
            <p className="text-xs text-[var(--secondary)]">
              {ca.type} · {ca.parent} vs {ca.tutor}
            </p>
            <p className="mt-1 font-mono text-sm font-bold text-[var(--primary)]">
              {ca.amount} ETB escrow
            </p>
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div>
            <p className="text-xl font-black">{c.id}</p>
            <p className="text-sm text-[var(--secondary)]">
              {c.type} · Escrow {c.amount} ETB
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-lg bg-teal-500 px-3 py-2 text-xs font-bold text-white">
              Release to Tutor
            </button>
            <button type="button" className="rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white">
              Refund Parent
            </button>
            <button type="button" className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold">
              Escalate
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="mb-3 font-bold">Conversation log</p>
          <div className="space-y-3 text-sm">
            <p className="rounded-xl bg-[var(--muted)] p-3">
              <span className="font-bold text-[var(--primary)]">Parent:</span> Tutor never
              showed. Waited 40 minutes.
            </p>
            <p className="rounded-xl bg-[var(--muted)] p-3">
              <span className="font-bold text-amber-600">Tutor:</span> Family emergency —
              could not reach parent.
            </p>
          </div>
          <div className="mt-4 flex gap-2 text-xs font-bold">
            <span className="rounded-full bg-red-50 px-2 py-1 text-red-600">❌ Tutor no check-in</span>
            <span className="rounded-full bg-teal-50 px-2 py-1 text-[var(--primary)]">
              ✅ Parent logged in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}