"use client";

import Link from "next/link";

const CONTRACTS = [
  {
    id: "c1",
    family: "Mulugeta Family",
    child: "Kidist",
    subject: "Math · Grade 11",
    rate: "450 ETB/hr",
    status: "ACTIVE",
    escrowHeld: 3600,
    sessionsDone: 6,
    sessionsTotal: 8,
    nextSession: "Today · 10:00 AM",
  },
  {
    id: "c2",
    family: "Hailu Family",
    child: "Yonas",
    subject: "Physics · Grade 10",
    rate: "480 ETB/hr",
    status: "ACTIVE",
    escrowHeld: 2400,
    sessionsDone: 3,
    sessionsTotal: 6,
    nextSession: "Tomorrow · 2:00 PM",
  },
  {
    id: "c3",
    family: "Bekele Family",
    child: "Sara",
    subject: "Chemistry · Grade 12",
    rate: "500 ETB/hr",
    status: "COMPLETED",
    escrowHeld: 0,
    sessionsDone: 10,
    sessionsTotal: 10,
    nextSession: "—",
  },
];

export default function TeacherContractsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--foreground)]">
          Active Contracts
        </h1>
        <p className="text-sm text-[var(--secondary)]">
          Escrow-backed tutoring agreements · funds release after verified sessions
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          ["2", "Active"],
          ["6,000 ETB", "In escrow"],
          ["1", "Completed"],
        ].map(([v, l]) => (
          <div
            key={l}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4"
          >
            <p className="text-xl font-black text-[var(--primary)]">{v}</p>
            <p className="text-xs text-[var(--secondary)]">{l}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {CONTRACTS.map((c) => {
          const pct = Math.round((c.sessionsDone / c.sessionsTotal) * 100);
          return (
            <div
              key={c.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 md:p-6"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-extrabold text-[var(--foreground)]">
                    {c.family}
                  </p>
                  <p className="text-sm text-[var(--secondary)]">
                    {c.child} · {c.subject}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                    c.status === "ACTIVE"
                      ? "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40"
                      : "bg-[var(--muted)] text-[var(--secondary)]"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-[var(--muted)] p-3">
                  <p className="text-[11px] text-[var(--secondary)]">Rate</p>
                  <p className="font-mono font-bold text-[var(--primary)]">{c.rate}</p>
                </div>
                <div className="rounded-xl bg-[var(--muted)] p-3">
                  <p className="text-[11px] text-[var(--secondary)]">Escrow held</p>
                  <p className="font-mono font-bold text-[var(--foreground)]">
                    {c.escrowHeld.toLocaleString()} ETB
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--muted)] p-3">
                  <p className="text-[11px] text-[var(--secondary)]">Next session</p>
                  <p className="font-bold text-[var(--foreground)]">{c.nextSession}</p>
                </div>
              </div>

              <div className="mb-2 flex justify-between text-xs font-semibold text-[var(--secondary)]">
                <span>
                  Sessions {c.sessionsDone}/{c.sessionsTotal}
                </span>
                <span>{pct}%</span>
              </div>
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)]"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/teacher/sessions/${c.id}`}
                  className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
                >
                  Open session
                </Link>
                <Link
                  href="/teacher/chat"
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--foreground)]"
                >
                  Message parent
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}