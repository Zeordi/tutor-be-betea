"use client";

import Link from "next/link";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const EVENTS = [
  { day: "Mon", child: "Kidane", color: "#0D9488", title: "Math · Selamawit", time: "4:00 PM" },
  { day: "Wed", child: "Meron", color: "#0284C7", title: "English · Bereket", time: "3:00 PM" },
  { day: "Fri", child: "Kidane", color: "#0D9488", title: "Physics · Selamawit", time: "5:00 PM" },
];

export default function ParentCalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text)]">Family Calendar</h1>
          <p className="text-sm text-[var(--secondary)]">
            Color-coded by child · this week
          </p>
        </div>
        <Link
          href="/parent/sessions"
          className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--text)]"
        >
          Session list
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { name: "Kidane", color: "#0D9488" },
          { name: "Meron", color: "#0284C7" },
        ].map((c) => (
          <span
            key={c.name}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-bold"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
            {c.name}
          </span>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-7">
        {DAYS.map((d) => {
          const dayEvents = EVENTS.filter((e) => e.day === d);
          return (
            <div
              key={d}
              className="min-h-[120px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3"
            >
              <p className="mb-2 text-xs font-extrabold text-[var(--secondary)]">{d}</p>
              <div className="space-y-2">
                {dayEvents.map((e) => (
                  <div
                    key={e.title}
                    className="rounded-lg p-2 text-[10px] font-semibold text-white"
                    style={{ backgroundColor: e.color }}
                  >
                    <p>{e.time}</p>
                    <p className="opacity-90">{e.title}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}