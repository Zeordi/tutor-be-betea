"use client";

import Link from "next/link";

const SESSIONS = [
  {
    contractId: "c1",
    tutor: "Berhane Alemu",
    child: "Kidist",
    subject: "Math",
    when: "Today · 10:00 AM",
    status: "upcoming",
    place: "Bole · In person",
  },
  {
    contractId: "c2",
    tutor: "Selamawit Bekele",
    child: "Kidist",
    subject: "Chemistry",
    when: "Tomorrow · 2:00 PM",
    status: "upcoming",
    place: "Online",
  },
  {
    contractId: "c3",
    tutor: "Berhane Alemu",
    child: "Kidist",
    subject: "Physics",
    when: "Aug 27 · Completed",
    status: "completed",
    place: "Bole · In person",
  },
  {
    contractId: "c4",
    tutor: "Dawit Haile",
    child: "Dawit Jr",
    subject: "English",
    when: "Aug 15 · Completed",
    status: "completed",
    place: "Online",
  },
];

function statusStyle(s: string) {
  if (s === "upcoming")
    return "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40";
  if (s === "live") return "bg-emerald-50 text-emerald-700";
  return "bg-[var(--muted)] text-[var(--secondary)]";
}

export default function ParentSessionsIndexPage() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">Sessions</h1>
          <p className="text-sm text-[var(--secondary)]">
            Upcoming and recent sessions · open a session for check-in details
          </p>
        </div>
        <Link
          href="/parent/history"
          className="text-sm font-bold text-[var(--primary)]"
        >
          Full history & invoices →
        </Link>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          ["2", "Upcoming"],
          ["1", "This week done"],
          ["0", "Needs confirmation"],
        ].map(([v, l]) => (
          <div
            key={l}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4"
          >
            <p className="text-2xl font-black text-[var(--primary)]">{v}</p>
            <p className="text-xs text-[var(--secondary)]">{l}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {SESSIONS.map((s) => (
          <Link
            key={s.contractId}
            href={`/parent/sessions/${s.contractId}`}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--primary)]/40 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <p className="font-extrabold text-[var(--foreground)]">{s.subject}</p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${statusStyle(s.status)}`}
                >
                  {s.status}
                </span>
              </div>
              <p className="text-sm text-[var(--secondary)]">
                {s.tutor} · {s.child}
              </p>
              <p className="mt-1 text-xs text-[var(--secondary)]">
                {s.when} · {s.place}
              </p>
            </div>
            <span className="text-sm font-bold text-[var(--primary)]">Open →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}