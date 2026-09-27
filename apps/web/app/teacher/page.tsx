"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type TeacherMe = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  teacherProfile: {
    connectsBalance: number;
    rating?: number;
    reviewCount?: number;
    isVerified?: boolean;
    idVerified?: boolean;
    degreeVerified?: boolean;
  } | null;
};

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

type TeacherEarnings = {
  totalEarned: number;
  pendingPayout: number;
  payouts: Array<{
    id: string;
    amount: number;
    provider: string;
    status: string;
    createdAt: string;
    paidAt?: string;
  }>;
};

type VerificationStatus = {
  docs: Array<{
    id: string;
    label: string;
    status: string;
    statusLabel: string;
    note?: string;
    icon: string;
  }>;
  adminNote: string;
  adminNoteDate: string;
  adminNoteAuthor: string;
};

type Job = {
  id: string;
  title: string;
  family: string;
  loc: string;
  cur: string;
  hrs: string;
  budget: string;
  children: number;
  urgency: string;
  posted: string;
  description: string;
  requirements: string[];
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function statusBadgeClass(status: string) {
  if (status === "ACTIVE")
    return "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300";
  if (status === "PENDING_ESCROW")
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300";
  if (status === "COMPLETED")
    return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  if (status === "DISPUTED")
    return "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300";
  return "bg-[var(--muted)] text-[var(--secondary)]";
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function TeacherHomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState<TeacherMe | null>(null);
  const [contracts, setContracts] = useState<ApiContract[]>([]);
  const [earnings, setEarnings] = useState<TeacherEarnings | null>(null);
  const [verification, setVerification] = useState<VerificationStatus | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.allSettled([
      apiFetch<TeacherMe>(paths.usersMe),
      apiFetch<ApiContract[]>(paths.contractsTeacher),
      apiFetch<TeacherEarnings>(paths.teacherEarnings),
      apiFetch<VerificationStatus>(paths.verificationStatus),
      apiFetch<Job[]>(paths.jobsOpen),
    ]).then((results) => {
      if (cancelled) return;
      const meResult = results[0];
      const contractsResult = results[1];
      const earningsResult = results[2];
      const verificationResult = results[3];
      const jobsResult = results[4];

      if (meResult.status === "rejected") {
        setError(meResult.reason?.message || "Failed to load profile");
        return;
      }
      if (meResult.status === "fulfilled") setMe(meResult.value);
      if (contractsResult.status === "fulfilled") setContracts(contractsResult.value || []);
      if (earningsResult.status === "fulfilled") setEarnings(earningsResult.value || null);
      if (verificationResult.status === "fulfilled") setVerification(verificationResult.value || null);
      if (jobsResult.status === "fulfilled") setJobs(jobsResult.value || []);
    }).catch((err) => {
      if (!cancelled) setError(err.message || "Failed to load dashboard");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  const tp = me?.teacherProfile;
  const displayName = me?.fullName || "Teacher";
  const firstName = displayName.split(" ")[0] || "there";

  const today = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    return { start, end };
  }, []);

  const todaySessions = useMemo(() => {
    return contracts
      .filter((c) => {
        const d = new Date(c.startDate);
        return d >= today.start && d < today.end;
      })
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        startDate: c.startDate,
        endDate: c.endDate,
        subject: c.student?.subjects?.[0] || "General",
        studentName: c.student?.studentName || "Student",
        parentName: c.parent?.fullName || null,
        status: c.status,
        agreedAmount: c.agreedAmount,
      }));
  }, [contracts, today]);

  const todayCount = todaySessions.length;
  const totalEarnings = earnings?.totalEarned ?? 0;
  const rating = tp?.rating ?? 0;
  const reviewCount = tp?.reviewCount ?? 0;
  const connectsBalance = tp?.connectsBalance ?? 0;

  const isVerified = tp?.isVerified ?? false;
  const idVerified = tp?.idVerified ?? false;
  const degreeVerified = tp?.degreeVerified ?? false;

  const openJobsCount = jobs.length;

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-8">
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

  const sessionLabel = todayCount === 1 ? "session today" : `${todayCount} sessions today`;

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h2 className="mb-1 text-xl font-extrabold text-slate-800 dark:text-white">
          {getGreeting()}, {firstName} 👋
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {todayCount > 0 ? sessionLabel : "No sessions scheduled for today."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-xl font-extrabold text-teal-600">
            {totalEarnings.toLocaleString()} ETB
          </p>
          <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">Earnings</p>
          <p className="text-[10px] text-slate-400">Total earned</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-xl font-extrabold text-teal-600">
            {rating > 0 ? `${rating.toFixed(1)} ⭐` : "—"}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">Rating</p>
          <p className="text-[10px] text-slate-400">{reviewCount} reviews</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-xl font-extrabold text-teal-600">{contracts.length}</p>
          <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">Sessions</p>
          <p className="text-[10px] text-slate-400">Total contracts</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
          <p className="text-xl font-extrabold text-teal-600">{connectsBalance}</p>
          <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">Connects</p>
          <p className="text-[10px] text-slate-400">Balance left</p>
        </div>
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
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                >
                  <div className="h-12 w-2 flex-shrink-0 rounded-full bg-teal-500" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      {s.subject} · {s.studentName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {s.parentName ? `${s.parentName} · ` : ""}
                      {formatTime(s.startDate)} – {formatTime(s.endDate)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusBadgeClass(s.status)}`}
                  >
                    {s.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]">
            <p className="mb-2 text-sm font-bold text-slate-800 dark:text-white">🔗 Connects Balance</p>
            <p className="text-3xl font-extrabold text-teal-600">{connectsBalance}</p>
            <p className="mb-3 text-xs text-slate-400">Available for applications</p>
            <Link
              href="/teacher/settings"
              className="inline-flex rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-700"
            >
              Buy Connects
            </Link>
          </div>

          <div
            className={`rounded-2xl border p-4 ${
              isVerified
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
            }`}
          >
            <p
              className={`text-sm font-bold ${
                isVerified
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-amber-700 dark:text-amber-300"
              }`}
            >
              {isVerified ? "🛡️ Fully Verified" : "⚠️ Verification in progress"}
            </p>
            <p
              className={`text-xs ${
                isVerified
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {idVerified ? "National ID ✓" : "National ID pending"} ·{" "}
              {degreeVerified ? "Degree ✓" : "Degree pending"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]">
            <p className="mb-2 text-sm font-bold text-slate-800 dark:text-white">✨ New Matches</p>
            <p className="text-3xl font-extrabold text-teal-600">{openJobsCount}</p>
            <p className="mb-3 text-xs text-slate-400">Open jobs matching you</p>
            <Link
              href="/teacher/jobs"
              className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-xs font-bold text-[var(--foreground)] transition hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              View Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
