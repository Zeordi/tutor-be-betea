"use client";

import Link from "next/link";

const DAYS = ["Mon 1", "Tue 2", "Wed 3", "Thu 4", "Fri 5", "Sat 6", "Sun 7"];
const HOURS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

type Ev = {
  day: number;
  hour: string;
  child: string;
  color: string;
  title: string;
  tutor: string;
};

const EVENTS: Ev[] = [
  { day: 0, hour: "16:00", child: "Kidane", color: "#0D9488", title: "Math", tutor: "Selamawit" },
  { day: 2, hour: "15:00", child: "Meron", color: "#0284C7", title: "English", tutor: "Bereket" },
  { day: 2, hour: "16:00", child: "Kidane", color: "#0D9488", title: "Physics", tutor: "Selamawit" },
  { day: 4, hour: "17:00", child: "Kidane", color: "#0D9488", title: "Math review", tutor: "Selamawit" },
  { day: 5, hour: "10:00", child: "Meron", color: "#0284C7", title: "Reading", tutor: "Hana" },
];

const CHILDREN = [
  { name: "Kidane", color: "#0D9488", grade: "Grade 10" },
  { name: "Meron", color: "#0284C7", grade: "Grade 7" },
];

export default function ParentCalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Family Calendar</h1>
          <p className="text-sm text-[var(--secondary)]">
            Weekly view · color-coded by child · Sep 1–7, 2026
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/parent/checkout"
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
          >
            Book session
          </Link>
          <Link
            href="/parent/sessions"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--foreground)]"
          >
            Session list
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {CHILDREN.map((c) => (
          <span
            key={c.name}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-bold text-[var(--foreground)]"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
            {c.name}
            <span className="font-semibold text-[var(--secondary)]">{c.grade}</span>
          </span>
        ))}
      </div>

      {/* Desktop week grid */}
      <div className="hidden overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] md:block">
        <div className="grid min-w-[720px] grid-cols-[64px_repeat(7,1fr)]">
          <div className="border-b border-[var(--border)] p-2" />
          {DAYS.map((d) => (
            <div
              key={d}
              className="border-b border-l border-[var(--border)] p-2 text-center text-xs font-extrabold text-[var(--secondary)]"
            >
              {d}
            </div>
          ))}
          {HOURS.map((h) => (
            <>
              <div
                key={`h-${h}`}
                className="border-b border-[var(--border)] p-2 text-[11px] font-semibold text-[var(--secondary)]"
              >
                {h}
              </div>
              {DAYS.map((_, di) => {
                const hit = EVENTS.find((e) => e.day === di && e.hour === h);
                return (
                  <div
                    key={`\( {di}- \){h}`}
                    className="min-h-[52px] border-b border-l border-[var(--border)] p-1"
                  >
                    {hit && (
                      <div
                        className="h-full rounded-lg px-1.5 py-1 text-[10px] font-semibold text-white"
                        style={{ backgroundColor: hit.color }}
                      >
                        <p className="truncate font-bold">{hit.title}</p>
                        <p className="truncate opacity-90">{hit.tutor}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Mobile day cards */}
      <div className="space-y-3 md:hidden">
        {DAYS.map((d, di) => {
          const dayEvents = EVENTS.filter((e) => e.day === di);
          return (
            <div
              key={d}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <p className="mb-3 text-xs font-extrabold text-[var(--secondary)]">{d}</p>
              {dayEvents.length === 0 ? (
                <p className="text-xs text-[var(--secondary)]">No sessions</p>
              ) : (
                <div className="space-y-2">
                  {dayEvents.map((e) => (
                    <div
                      key={`\( {e.hour}- \){e.title}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white"
                      style={{ backgroundColor: e.color }}
                    >
                      <span className="font-mono text-xs font-bold opacity-90">{e.hour}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold">
                          {e.title} · {e.child}
                        </p>
                        <p className="truncate text-xs opacity-90">{e.tutor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}