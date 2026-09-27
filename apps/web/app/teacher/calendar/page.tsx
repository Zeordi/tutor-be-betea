"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type ApiContract = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  agreedAmount: number;
  escrowHeldAmount: number;
  parent: { fullName: string } | null;
  student: { studentName: string; subjects: string[]; gradeLevel: string } | null;
};

type Contract = {
  id: string;
  subject: string;
  studentName: string;
  parentName: string;
  schedule: string;
  location?: string;
  meetingMode?: string;
  status: "ACTIVE" | "COMPLETED" | "PAUSED" | "INACTIVE";
  agreedAmount: number;
  sessionCredits: number;
  maxCredits: number;
};

function toContract(data: ApiContract): Contract {
  const subject = data.student?.subjects?.[0] || "General";
  return {
    id: data.id,
    subject,
    studentName: data.student?.studentName || "Student",
    parentName: data.parent?.fullName || "Parent",
    schedule: data.startDate,
    location: data.student?.subjects?.[0] || undefined,
    meetingMode: data.status === "ACTIVE" ? "IN_PERSON" : undefined,
    status: data.status as Contract["status"],
    agreedAmount: Number(data.agreedAmount || 0),
    sessionCredits: 0,
    maxCredits: 0,
  };
}

function statusClass(status: string) {
  if (status === "ACTIVE")
    return "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300";
  if (status === "COMPLETED")
    return "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300";
  if (status === "PAUSED")
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/30";
  return "bg-[var(--muted)] text-[var(--secondary)]";
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export default function TeacherCalendarPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [view, setView] = useState<"month" | "week">("month");
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, Contract[]>();
    for (const c of contracts) {
      const d = new Date(c.schedule);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const arr = map.get(key) || [];
      arr.push(c);
      map.set(key, arr);
    }
    return map;
  }, [contracts]);

  const monthCells = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ date: Date; inMonth: boolean }> = [];

    const prevMonth = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ date: new Date(year, month - 1, prevMonth - i), inMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({ date: new Date(year, month, i), inMonth: true });
    }
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({ date: new Date(year, month + 1, i), inMonth: false });
    }
    return cells;
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day;
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(new Date(start.getFullYear(), start.getMonth(), diff + i));
    }
    return days;
  }, [currentDate]);

  const upcoming = useMemo(() => {
    return contracts
      .filter((c) => new Date(c.schedule) >= new Date())
      .sort((a, b) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime())
      .slice(0, 10);
  }, [contracts]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<ApiContract[]>(paths.contractsTeacher)
      .then((data) => {
        if (!cancelled) setContracts((data || []).map(toContract));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load calendar");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const shift = (delta: number) => {
    setCurrentDate((d) => {
      if (view === "month") return new Date(d.getFullYear(), d.getMonth() + delta, 1);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta * 7);
    });
  };

  const isToday = (d: Date) => {
    const t = new Date();
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
  };

  const monthLabel = currentDate.toLocaleString("default", { month: "long", year: "numeric" });
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const weekLabel = `${weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${weekEnd.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;

  if (loading) {
    return (
      <div className="space-y-5 p-4 md:p-8">
        <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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
    <div className="space-y-5 p-4 md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white">Calendar</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {view === "month" ? monthLabel : weekLabel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setView("month")}
              className={`px-3 py-2 text-xs font-bold ${
                view === "month" ? "bg-teal-600 text-white" : "bg-white text-slate-600 dark:bg-[#112240] dark:text-slate-300"
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setView("week")}
              className={`px-3 py-2 text-xs font-bold ${
                view === "week" ? "bg-teal-600 text-white" : "bg-white text-slate-600 dark:bg-[#112240] dark:text-slate-300"
              }`}
            >
              Week
            </button>
          </div>
          <button
            type="button"
            onClick={() => shift(-1)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            ›
          </button>
          <Link
            href="/teacher/sessions"
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Session list
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
        <div className="mb-3 grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400">
          {DAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {view === "month" ? (
          <div className="grid grid-cols-7 gap-2">
            {monthCells.map((cell, idx) => {
              const key = `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`;
              const daySessions = sessionsByDate.get(key) || [];
              const today = isToday(cell.date);
              return (
                <div
                  key={idx}
                  className={`min-h-[72px] rounded-xl border p-1.5 ${
                    cell.inMonth
                      ? "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900/40"
                      : "border-transparent bg-slate-50/60 text-slate-300 dark:text-slate-600"
                  } ${today ? "ring-1 ring-inset ring-teal-500" : ""}`}
                >
                  <p className={`text-[11px] font-semibold ${today ? "text-teal-600" : "text-slate-500 dark:text-slate-400"}`}>
                    {cell.date.getDate()}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {daySessions.slice(0, 2).map((s) => (
                      <span
                        key={s.id}
                        className="truncate rounded-md bg-teal-50 px-1 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                      >
                        {s.subject}
                      </span>
                    ))}
                  </div>
                  {daySessions.length > 2 && (
                    <p className="mt-0.5 text-[10px] font-semibold text-teal-600 dark:text-teal-400">
                      +{daySessions.length - 2}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((d) => {
              const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
              const daySessions = sessionsByDate.get(key) || [];
              const today = isToday(d);
              return (
                <div
                  key={d.toISOString()}
                  className={`min-h-[88px] rounded-xl border p-2 ${
                    today
                      ? "border-teal-200 bg-teal-50/50 dark:border-teal-900 dark:bg-teal-950/20"
                      : "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900/40"
                  }`}
                >
                  <p className={`text-[11px] font-semibold ${today ? "text-teal-600" : "text-slate-500 dark:text-slate-400"}`}>
                    {DAYS[d.getDay()]} {d.getDate()}
                  </p>
                  <div className="mt-1 space-y-1">
                    {daySessions.map((s) => (
                      <Link
                        key={s.id}
                        href={`/teacher/sessions/${s.id}`}
                        className="block truncate rounded-md bg-teal-50 px-1.5 py-1 text-[10px] font-bold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                      >
                        {new Date(s.schedule).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
                        {s.subject}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Upcoming sessions
        </h2>
        {upcoming.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-[#112240]">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No upcoming sessions</p>
            <p className="mt-1 text-xs text-slate-400">Sessions will appear here when scheduled.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map((s) => (
              <Link
                key={s.id}
                href={`/teacher/sessions/${s.id}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-teal-200 dark:border-slate-800 dark:bg-[#112240]"
              >
                <div className="h-12 w-2 flex-shrink-0 rounded-full bg-teal-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {s.subject} · {s.studentName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {s.parentName} · {new Date(s.schedule).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass(s.status)}`}>{s.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
