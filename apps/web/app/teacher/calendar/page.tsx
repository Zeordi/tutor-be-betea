"use client";

import Link from "next/link";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = [2, 3, 4, 5, 6, 7, 8];
const SESSIONS = [
  { day: "Mon", time: "4:00 PM", student: "Kidane M.", sub: "Mathematics", id: "c1" },
  { day: "Wed", time: "3:00 PM", student: "Liya A.", sub: "Physics", id: "c2" },
  { day: "Fri", time: "5:00 PM", student: "Kidane M.", sub: "Algebra", id: "c1" },
  { day: "Sat", time: "10:00 AM", student: "Meron H.", sub: "English", id: "c3" },
];

export default function TeacherCalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text)]">Calendar</h1>
          <p className="text-sm text-[var(--secondary)]">June 2025 · {SESSIONS.length} sessions this week</p>
        </div>
        <Link
          href="/teacher/availability"
          className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
        >
          Edit availability
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((d, i) => {
          const active = i === 0;
          const has = SESSIONS.some((s) => s.day === d);
          return (
            <div
              key={d}
              className={`rounded-xl border border-[var(--border)] p-3 text-center ${
                active ? "bg-[var(--primary)] text-white" : "bg-[var(--card)]"
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
        {SESSIONS.map((s, i) => (
          <Link
            key={`\( {s.id}- \){i}`}
            href={`/teacher/sessions/${s.id}`}
            className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:shadow-md"
          >
            <div className="w-16 text-center">
              <p className="text-xs font-bold text-[var(--primary)]">{s.day}</p>
              <p className="text-sm font-extrabold text-[var(--text)]">{s.time}</p>
            </div>
            <div className="h-10 w-px bg-[var(--border)]" />
            <div className="flex-1">
              <p className="font-bold text-[var(--text)]">{s.student}</p>
              <p className="text-sm text-[var(--secondary)]">{s.sub}</p>
            </div>
            <span className="text-[var(--primary)] font-bold">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}