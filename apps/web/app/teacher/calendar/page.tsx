"use client";

import Link from "next/link";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = [1, 2, 3, 4, 5, 6, 7];

const SESSIONS = [
  {
    day: "Mon",
    time: "4:00 PM",
    student: "Kidane M.",
    sub: "Mathematics",
    loc: "Bole",
    id: "c1",
  },
  {
    day: "Wed",
    time: "3:00 PM",
    student: "Liya A.",
    sub: "Physics",
    loc: "Yeka",
    id: "c2",
  },
  {
    day: "Fri",
    time: "5:00 PM",
    student: "Kidane M.",
    sub: "Algebra",
    loc: "Bole",
    id: "c1",
  },
  {
    day: "Sat",
    time: "10:00 AM",
    student: "Meron H.",
    sub: "English",
    loc: "Sarbet",
    id: "c3",
  },
];

export default function TeacherCalendarPage() {
  const today = "Mon";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Calendar</h1>
          <p className="text-sm text-[var(--secondary)]">
            Sep 2026 · {SESSIONS.length} sessions this week
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/teacher/sessions"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--foreground)]"
          >
            Session list
          </Link>
          <Link
            href="/teacher/availability"
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
          >
            Edit availability
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((d, i) => {
          const active = d === today;
          const has = SESSIONS.some((s) => s.day === d);
          return (
            <div
              key={d}
              className={`rounded-xl border p-3 text-center ${
                active
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                  : "border-[var(--border)] bg-[var(--card)]"
              }`}
            >
              <p className="text-[10px] font-bold opacity-80">{d}</p>
              <p className="text-lg font-black">{DATES[i]}</p>
              {has && (
                <span
                  className={`mt-1 inline-block h-1.5 w-1.5 rounded-full ${
                    active ? "bg-white" : "bg-[var(--primary)]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-[var(--secondary)]">
          Upcoming this week
        </h2>
        {SESSIONS.map((s, i) => (
          <Link
            key={`\( {s.id}- \){s.day}-${i}`}
            href={`/teacher/sessions/${s.id}`}
            className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:shadow-md"
          >
            <div className="w-16 shrink-0 text-center">
              <p className="text-xs font-bold text-[var(--primary)]">{s.day}</p>
              <p className="text-sm font-extrabold text-[var(--foreground)]">{s.time}</p>
            </div>
            <div className="h-10 w-px bg-[var(--border)]" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[var(--foreground)]">{s.student}</p>
              <p className="text-sm text-[var(--secondary)]">
                {s.sub} · 📍 {s.loc}
              </p>
            </div>
            <span className="font-bold text-[var(--primary)]">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}