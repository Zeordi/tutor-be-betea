"use client";

import Link from "next/link";

const SESSIONS = [
  {
    contractId: "c1",
    parent: "Hana Mulugeta",
    child: "Kidist",
    subject: "Math",
    when: "Today · 10:00 AM",
    status: "upcoming",
    place: "Bole · In person",
  },
  {
    contractId: "c2",
    parent: "Abel Hailu",
    child: "Yonas",
    subject: "Physics",
    when: "Tomorrow · 2:00 PM",
    status: "upcoming",
    place: "Online",
  },
  {
    contractId: "c3",
    parent: "Hana Mulugeta",
    child: "Kidist",
    subject: "Math",
    when: "Aug 27 · Completed",
    status: "completed",
    place: "Bole · In person",
  },
];

function statusClass(s: string) {
  if (s === "upcoming")
    return "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40";
  return "bg-[var(--muted)] text-[var(--secondary)]";
}

export default function TeacherSessionsIndexPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--foreground)]">Sessions</h1>
        <p className="text-sm text-[var(--secondary)]">
          Upcoming and recent sessions · open for check-in / details
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          ["2", "Upcoming"],
          ["1", "Completed this week"],
          ["0", "Needs check-out"],
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
            href={`/teacher/sessions/${s.contractId}`}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--primary)]/40 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <p className="font-extrabold text-[var(--foreground)]">{s.subject}</p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${statusClass(s.status)}`}
                >
                  {s.status}
                </span>
              </div>
              <p className="text-sm text-[var(--secondary)]">
                {s.parent} · {s.child}
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