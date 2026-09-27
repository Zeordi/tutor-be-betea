"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type CurrentUser = {
  fullName: string;
  phoneNumber: string;
  email: string | null;
  role: string;
};

type Contract = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  teacher: { fullName: string; avatarUrl: string | null };
  student: { studentName: string; gradeLevel: string; subjects?: string[] };
};

type Child = {
  id: string;
  studentName: string;
  gradeLevel: string;
  contracts?: { id: string; status: string; teacherId: string }[];
};

type ProgressReport = {
  contractId: string;
  quizScore: number | null;
  weekNumber?: number;
  contract: {
    id: string;
    student: {
      studentName: string;
      gradeLevel: string;
    };
  };
};

type Wallet = {
  escrowHeld: number;
};

export default function ParentHomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState<CurrentUser | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [progress, setProgress] = useState<ProgressReport[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.allSettled([
      apiFetch<CurrentUser>(paths.usersMe),
      apiFetch<Contract[]>(paths.contractsParent),
      apiFetch<Child[]>(paths.children),
      apiFetch<Wallet>(paths.wallet),
      apiFetch<ProgressReport[]>(paths.progressMine),
    ]).then((results) => {
      if (!cancelled) {
        const meResult = results[0];
        const contractsResult = results[1];
        const childrenResult = results[2];
        const walletResult = results[3];
        const progressResult = results[4];

        if (meResult.status === "rejected") {
          setError(meResult.reason?.message || "Failed to load profile");
          return;
        }

        setMe(meResult.value);
        setContracts(contractsResult.status === "fulfilled" ? (contractsResult.value || []) : []);
        setChildren(childrenResult.status === "fulfilled" ? (childrenResult.value || []) : []);
        setWallet(walletResult.status === "fulfilled" ? walletResult.value : null);
        setProgress(progressResult.status === "fulfilled" ? (progressResult.value || []) : []);
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

  const activeCount = contracts.filter((c) => c.status === "ACTIVE").length;
  const upcomingCount = contracts.filter((c) => c.status === "PENDING_ESCROW").length;
  const scores = progress
    .map((p) => p.quizScore)
    .filter((s): s is number => s != null);
  const avgProgress =
    scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
      : 0;

  const upcomingSessions = contracts
    .filter((c) => c.status === "PENDING_ESCROW" || c.status === "ACTIVE")
    .slice(0, 3);

  const contractToChild = new Map<string, Child>();
  children.forEach((child) => {
    child.contracts?.forEach((c) => {
      contractToChild.set(c.id, child);
    });
  });

  const childLatestProgress = new Map<string, number | null>();
  progress.forEach((p) => {
    const child = contractToChild.get(p.contractId);
    if (child && !childLatestProgress.has(child.id)) {
      childLatestProgress.set(child.id, p.quizScore);
    }
  });

  const firstName = me?.fullName?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h2 className="mb-1 text-xl font-extrabold text-slate-800 dark:text-white">
            {timeGreeting} 👋
          </h2>
          <p className="text-sm text-slate-500">Loading your dashboard…</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-800"
            />
          ))}
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
          {timeGreeting}, {firstName} 👋
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Here&apos;s your family dashboard overview
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Active Sessions", String(activeCount), `${activeCount} active`, "📚"],
          ["Avg. Progress", `${avgProgress}%`, avgProgress > 0 ? "↑ Live" : "—", "📊"],
          [
            "Escrow Held",
            `${(wallet?.escrowHeld || 0).toLocaleString()} ETB`,
            `${activeCount} contracts`,
            "🔒",
          ],
          ["Upcoming", String(upcomingCount), "This week", "📅"],
        ].map(([label, value, sub, icon]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]"
          >
            <div className="mb-3 flex items-start justify-between">
              <span className="text-2xl">{icon}</span>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                {sub}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-teal-600">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240] md:col-span-2">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">
            Upcoming Sessions
          </h3>
          <div className="space-y-3">
            {upcomingSessions.length === 0 && (
              <p className="text-sm text-slate-400">No upcoming sessions.</p>
            )}
            {upcomingSessions.map((s) => {
              const subject = s.student.subjects?.[0] || s.student.gradeLevel;
              const dateStr = new Date(s.startDate).toLocaleDateString();
              const timeStr = new Date(s.startDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-lg dark:bg-teal-900/30">
                    📚
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {s.student.studentName} · {subject} · {s.teacher.fullName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {dateStr} · {timeStr}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      s.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    }`}
                  >
                    {s.status === "ACTIVE" ? "Confirmed" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">
            Children Summary
          </h3>
          <div className="space-y-3">
            {children.length === 0 && (
              <p className="text-sm text-slate-400">No children added yet.</p>
            )}
            {children.map((child) => {
              const prog = childLatestProgress.get(child.id);
              const progText = prog != null ? `${prog}%` : "—";
              return (
                <Link
                  key={child.id}
                  href={`/parent/children/${child.id}`}
                  className="block rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100 dark:bg-slate-800/50"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                      {child.studentName[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">
                        {child.studentName}
                      </p>
                      <p className="text-[10px] text-slate-400">{child.gradeLevel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full bg-teal-500"
                        style={{
                          width: progText === "—" ? "0%" : progText,
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-teal-600">
                      {progText}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
