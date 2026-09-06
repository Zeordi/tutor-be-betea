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
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([
    "Geofence: tutor never entered 150m radius.",
    "Parent waited 40 min — session auto-marked incomplete.",
  ]);
  const c = CASES[active];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-[var(--foreground)]">
        Dispute Resolution
      </h1>
      <div className="grid gap-5 xl:grid-cols-[260px_1fr_280px]">
        {/* Case list */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <p className="border-b border-[var(--border)] px-4 py-3 font-bold">
            Open ({CASES.length})
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
              <p className="font-bold text-[var(--foreground)]">{ca.id}</p>
              <p className="text-xs text-[var(--secondary)]">
                {ca.type} · {ca.parent}
              </p>
              <p className="mt-1 font-mono text-sm font-bold text-[var(--primary)]">
                {ca.amount} ETB
              </p>
            </button>
          ))}
        </div>

        {/* Chat / evidence */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div>
              <p className="text-xl font-black text-[var(--foreground)]">{c.id}</p>
              <p className="text-sm text-[var(--secondary)]">
                {c.type} · {c.parent} vs {c.tutor} · Escrow {c.amount} ETB
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg bg-teal-500 px-3 py-2 text-xs font-bold text-white"
              >
                Release to Tutor
              </button>
              <button
                type="button"
                className="rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white"
              >
                Refund Parent
              </button>
              <button
                type="button"
                className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold"
              >
                Escalate
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="mb-3 font-bold text-[var(--foreground)]">Conversation log</p>
            <div className="space-y-3 text-sm">
              <p className="rounded-xl bg-[var(--muted)] p-3">
                <span className="font-bold text-[var(--primary)]">Parent:</span> Tutor never
                showed. Waited 40 minutes at the address.
              </p>
              <p className="rounded-xl bg-[var(--muted)] p-3">
                <span className="font-bold text-amber-600">Tutor:</span> Family emergency —
                could not reach parent in-app in time.
              </p>
              <p className="rounded-xl border border-dashed border-[var(--border)] p-3 text-[var(--secondary)]">
                <span className="font-bold">System:</span> No geofence check-in within 150m.
                Attendance = incomplete.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded-full bg-red-50 px-2 py-1 text-red-600 dark:bg-red-950/40">
                ❌ Tutor no check-in
              </span>
              <span className="rounded-full bg-teal-50 px-2 py-1 text-[var(--primary)] dark:bg-teal-950/40">
                ✅ Parent online
              </span>
              <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700 dark:bg-amber-950/40">
                🔒 Escrow frozen
              </span>
            </div>
          </div>
        </div>

        {/* Staff notes */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="mb-3 font-bold text-[var(--foreground)]">Staff notes</p>
          <div className="mb-3 space-y-2">
            {notes.map((n, i) => (
              <p
                key={i}
                className="rounded-xl bg-[var(--muted)] p-3 text-xs leading-relaxed text-[var(--secondary)]"
              >
                {n}
              </p>
            ))}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Add internal note…"
            className="mb-2 w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
          />
          <button
            type="button"
            onClick={() => {
              if (!note.trim()) return;
              setNotes((prev) => [...prev, note.trim()]);
              setNote("");
            }}
            className="w-full rounded-xl bg-[var(--primary)] py-2.5 text-xs font-bold text-white"
          >
            Save note
          </button>
        </div>
      </div>
    </div>
  );
}