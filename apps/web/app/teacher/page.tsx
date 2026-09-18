"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";
import { getToken } from "@/lib/auth";

type TeacherMe = {
  id: string;
  fullName: string;
  email: string;
  teacherProfile: {
    hourlyRate: number;
    rating: number;
    reviewCount: number;
    connectsBalance: number;
    isVerified: boolean;
    idVerified: boolean;
    degreeVerified: boolean;
    badgeLevel: string;
  } | null;
};

type TodaySession = {
  id: string;
  schedule: string;
  studentName: string;
  subject: string;
  location: string;
  meetingMode: string;
};

type ContractShort = {
  id: string;
  subject: string;
  status: string;
  schedule: string;
};

type Wallet = {
  balance: number;
  currency: string;
};

export default function TeacherHomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState<TeacherMe | null>(null);
  const [todaySessions, setTodaySessions] = useState<TodaySession[]>([]);
  const [weeklySessionsCount, setWeeklySessionsCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([
      apiFetch<TeacherMe>(paths.usersMe),
      apiFetch<ContractShort[]>(paths.contractsTeacher),
    ])
      .then(([meData, contracts]) => {
        if (!cancelled) {
          setMe(meData);
          const now = new Date();
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);

          const weekSessions = contracts.filter((c) => {
            const d = new Date(c.schedule);
            return d >= startOfWeek && d <= endOfWeek;
          });
          setWeeklySessionsCount(weekSessions.length);

          const today = new Date().toDateString();
          const todayS = contracts.filter((c) => new Date(c.schedule).toDateString() === today);
          setTodaySessions(
            todayS.slice(0, 5).map((c) => ({
              id: c.id,
              schedule: c.schedule,
              studentName: "",
              subject: c.subject,
              location: "",
              meetingMode: "",
            })),
          );
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load dashboard");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const tp = me?.teacherProfile;
  const displayName = me?.fullName || "Teacher";
  const earnings = tp ? `${tp.hourlyRate * weeklySessionsCount} ETB` : "0 ETB";
  const rating = tp ? `${tp.rating.toFixed(1)} ⭐` : "—";
  const sessionCount = tp ? `${weeklySessionsCount}` : "0";
  const connects = tp ? `${tp.connectsBalance} left` : "0 left";

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-56 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800 md:col-span-2" />
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          </div>
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
    <div className="space-y-6 p-6">
      <div>
        <h2 className="mb-1 text-xl font-extrabold text-slate-800 dark:text-white">
          Good morning 👋
        </h2>
        <p className="text-sm text-slate-500">
          Welcome back, {displayName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["This Month", earnings, "💰"],
          ["Rating", rating, `${tp?.reviewCount || 0} reviews`],
          ["Sessions", sessionCount, "This month"],
          ["Connects", connects, "🔗 balance"],
        ].map(([label, val, sub]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]"
          >
            <p className="text-xl font-extrabold text-teal-600">{val}</p>
            <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">{label}</p>
            <p className="text-[10px] text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240] md:col-span-2">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">
            Today&apos;s Schedule
          </h3>
          <div className="space-y-3">
            {todaySessions.length === 0 ? (
              <p className="text-sm text-slate-400">No sessions scheduled for today.</p>
            ) : (
              todaySessions.map((s) => (
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
                      {new Date(s.schedule).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {s.meetingMode || s.location}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]">
            <p className="mb-2 text-sm font-bold text-slate-800 dark:text-white">🔗 Connects Balance</p>
            <p className="text-3xl font-extrabold text-teal-600">{tp?.connectsBalance ?? 0}</p>
            <p className="mb-3 text-xs text-slate-400">≈ {weeklySessionsCount} job applications</p>
          </div>
          <div
            className={`rounded-2xl p-4 ${
              tp?.isVerified
                ? "border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                : "border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
            }`}
          >
            <p
              className={`text-sm font-bold ${
                tp?.isVerified
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-amber-700 dark:text-amber-300"
              }`}
            >
              {tp?.isVerified ? "🛡️ Fully Verified" : "⚠️ Verification in progress"}
            </p>
            <p
              className={`text-xs ${
                tp?.isVerified
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {tp?.idVerified ? "National ID ✓" : "National ID pending"} · {tp?.degreeVerified ? "Degree ✓" : "Degree pending"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
