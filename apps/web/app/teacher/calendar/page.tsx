"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type Contract = {
  id: string;
  subject: string;
  studentName: string;
  schedule: string;
  location?: string;
  meetingMode?: string;
  status: string;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export default function TeacherCalendarPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const monthSessions = contracts.filter((c) => {
    const d = new Date(c.schedule);
    return (
      d.getFullYear() === currentMonth.getFullYear() &&
      d.getMonth() === currentMonth.getMonth()
    );
  });

  const toggleMonth = (dir: -1 | 1) => {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + dir, 1));
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<Contract[]>(paths.contractsTeacher)
      .then((data) => {
        if (!cancelled) setContracts(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load sessions");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const today = new Date();
  const firstWeekDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();
  const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

  const sessionOn = (date: Date) =>
    contracts.filter(
      (c) =>
        new Date(c.schedule).getFullYear() === date.getFullYear() &&
        new Date(c.schedule).getMonth() === date.getMonth() &&
        new Date(c.schedule).getDate() === date.getDate(),
    );

  const upcoming = contracts
    .filter((c) => new Date(c.schedule) >= new Date())
    .sort((a, b) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="rounded-2xl border border-[var(--border)] p-4">
          <div className="h-60 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Calendar</h1>
          <p className="text-sm text-[var(--secondary)]">
            {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })} ·{" "}
            {monthSessions.length} sessions this month
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => toggleMonth(-1)}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--foreground)]"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => toggleMonth(1)}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--foreground)]"
          >
            ›
          </button>
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

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="mb-3 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => toggleMonth(-1)}
            className="text-[var(--secondary)]"
          >
            ‹
          </button>
          <span className="text-sm font-bold text-[var(--foreground)]">
            {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
          <button
            type="button"
            onClick={() => toggleMonth(1)}
            className="text-[var(--secondary)]"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-[var(--secondary)]">
          {DAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {Array.from({ length: firstWeekDay(currentMonth) }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth(currentMonth) }).map((_, i) => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
            const sess = sessionOn(date);
            const isToday = date.toDateString() === today.toDateString();
            return (
              <div
                key={date.toISOString()}
                className="relative rounded-xl py-2"
              >
                <span
                  className={`absolute top-0.5 left-1/2 -translate-x-1/2 text-[10px] ${
                    isToday ? "font-black text-[var(--primary)]" : "text-[var(--secondary)]"
                  }`}
                >
                  {i + 1}
                </span>
                {sess.length > 0 && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {sess.slice(0, 2).map((_, di) => (
                      <span key={di} className="h-1 w-1 rounded-full bg-[var(--primary)]" />
                    ))}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-[var(--secondary)]">
          Upcoming this week
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-[var(--secondary)]">No upcoming sessions.</p>
        ) : (
          upcoming.map((s) => (
            <Link
              key={s.id}
              href={`/teacher/sessions/${s.id}`}
              className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
            >
              <div className="h-12 w-2 flex-shrink-0 rounded-full bg-teal-500" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {s.subject} · {s.studentName || "Student"}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(s.schedule).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ·{" "}
                  {s.meetingMode || s.location || ""}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
