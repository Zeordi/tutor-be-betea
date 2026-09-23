"use client";

import { useEffect, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

type ApiContract = {
  id: string;
  status: "ACTIVE" | "INACTIVE" | "PAUSED" | "COMPLETED" | "PENDING_ESCROW";
  startDate: string;
  endDate: string;
  teacher: { id: string; fullName: string; avatarUrl: string | null };
  student: { id: string; studentName: string; gradeLevel: string; subjects: string[] } | null;
};

type CalendarContract = {
  id: string;
  status: ApiContract["status"];
  startDate: string;
  tutorName: string;
  studentName: string;
  subject: string;
  grade: string;
};

const STATUS_COLORS: Record<CalendarContract["status"], string> = {
  ACTIVE: "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
  INACTIVE: "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
  PAUSED: "bg-amber-100/80 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
  COMPLETED: "bg-sky-100/80 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200",
  PENDING_ESCROW: "bg-amber-100/80 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
};

function toCalendarContracts(data: ApiContract[]): CalendarContract[] {
  return (data || []).map((c) => ({
    id: c.id,
    status: c.status,
    startDate: c.startDate,
    tutorName: c.teacher?.fullName || "Tutor",
    studentName: c.student?.studentName || "Student",
    subject: c.student?.subjects?.[0] || "General",
    grade: c.student?.gradeLevel || "",
  }));
}

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contracts, setContracts] = useState<CalendarContract[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();

  const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const firstWeekDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();

  const upcoming = contracts.filter((c) => {
    const d = new Date(c.startDate);
    return d >= new Date();
  });

  const sessionsOn = (date: Date) =>
    contracts.filter(
      (c) =>
        new Date(c.startDate).getFullYear() === date.getFullYear() &&
        new Date(c.startDate).getMonth() === date.getMonth() &&
        new Date(c.startDate).getDate() === date.getDate(),
    );

  const toggleMonth = (dir: -1 | 1) => {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + dir, 1));
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<ApiContract[]>(paths.contractsMine)
      .then((data) => {
        if (!cancelled) setContracts(toCalendarContracts(data || []));
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

  const hasSessionsThisMonth = (date: Date) => {
    const sessions = contracts.filter(
      (c) =>
        new Date(c.startDate).getFullYear() === date.getFullYear() &&
        new Date(c.startDate).getMonth() === date.getMonth(),
    );
    return sessions;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
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

  const monthSessions = hasSessionsThisMonth(currentMonth);
  const daySessions = selectedDate ? sessionsOn(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Calendar</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleMonth(-1)}
            className="rounded-xl border border-[var(--border)] px-3 py-1 text-sm font-bold"
          >
            ‹
          </button>
          <span className="text-sm font-bold text-[var(--foreground)]">
            {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
          <button
            type="button"
            onClick={() => toggleMonth(1)}
            className="rounded-xl border border-[var(--border)] px-3 py-1 text-sm font-bold"
          >
            ›
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] p-4">
        <div className="mb-4 grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-[var(--secondary)]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {Array.from({ length: firstWeekDay(currentMonth) }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth(currentMonth) }).map((_, i) => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
            const daySessions = sessionsOn(date);
            const isToday =
              date.toDateString() === today.toDateString();
            const isSelected =
              selectedDate?.toDateString() === date.toDateString();
            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={`relative rounded-xl py-2 ${
                  isSelected
                    ? "bg-[var(--primary)] text-white"
                    : daySessions.length
                      ? "bg-teal-50/80 dark:bg-teal-950/30"
                      : "hover:bg-[var(--muted)]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-1/2 -translate-x-1/2 text-[10px] ${
                    isToday && !isSelected ? "font-black text-[var(--primary)]" : ""
                  }`}
                >
                  {i + 1}
                </span>
                {daySessions.length > 0 && !isSelected && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {daySessions.slice(0, 3).map((_, di) => (
                      <span key={di} className="h-1 w-1 rounded-full bg-[var(--primary)]" />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase text-[var(--secondary)]">
          {selectedDate
            ? `Sessions — ${selectedDate.toLocaleDateString()}`
            : "Upcoming sessions"}
        </h3>
        {(selectedDate ? daySessions : monthSessions).length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--secondary)]">
            No sessions {selectedDate ? "for this day" : "this month"}.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(selectedDate ? daySessions : monthSessions).map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
              >
                <div className="mb-2 flex justify-between">
                  <p className="font-bold text-[var(--foreground)]">{c.tutorName}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${STATUS_COLORS[c.status]}`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="text-sm text-[var(--secondary)]">
                  {c.studentName} · {c.subject} · Grade {c.grade}
                </p>
                <p className="mt-1 text-xs text-[var(--secondary)]">
                  Starts {new Date(c.startDate).toLocaleString()}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => window.open(paths.sessionDetail(c.id), "_blank")}
                    className="flex-1 rounded-xl bg-[var(--primary)] py-2 text-xs font-bold text-white"
                  >
                    Open session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
