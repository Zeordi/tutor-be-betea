"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type Contract = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  teacher: { fullName: string; avatarUrl: string | null };
  student: { studentName: string };
};

type Child = {
  id: string;
  studentName: string;
  gradeLevel: string;
};

type ProgressReport = {
  contractId: string;
  quizScore: number | null;
};

type Wallet = {
  escrowHeld: number;
};

export default function ParentHomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [progress, setProgress] = useState<ProgressReport[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([
      apiFetch<Contract[]>(paths.contractsParent),
      apiFetch<Child[]>(paths.children),
      apiFetch<Wallet>(paths.wallet),
      apiFetch<ProgressReport[]>(paths.progressMine),
    ])
      .then(([contractsRes, childrenRes, walletRes, progressRes]) => {
        if (!cancelled) {
          setContracts(contractsRes || []);
          setChildren(childrenRes || []);
          setWallet(walletRes);
          setProgress(progressRes || []);
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
  const avgProgress =
    progress.length > 0
      ? Math.round(
          progress.reduce((sum, p) => sum + (p.quizScore || 0), 0) / progress.length,
        )
      : 0;

  const upcomingSessions = contracts
    .filter((c) => c.status === "PENDING_ESCROW" || c.status === "ACTIVE")
    .slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h2 className="mb-1 text-xl font-extrabold text-slate-800 dark:text-white">
            Good morning 👋
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
          Good morning 👋
        </h2>
        <p className="text-sm text-slate-500">
          Here&apos;s your family dashboard overview
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Active Sessions", String(activeCount), "+1 today", "📚"],
          ["Avg. Progress", `${avgProgress}%`, avgProgress > 0 ? "↑ Live" : "—", "📊"],
          ["Escrow Held", `${(wallet?.escrowHeld || 0).toLocaleString()} ETB`, `${contracts.filter((c) => c.status === "ACTIVE").length} contracts`, "🔒"],
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
            {upcomingSessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-lg dark:bg-teal-900/30">
                  📚
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {s.student.studentName} · {s.teacher.fullName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(s.startDate).toLocaleDateString()} ·{" "}
                    {s.status === "ACTIVE" ? "In progress" : "Awaiting escrow"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    s.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                  }`}
                >
                  {s.status === "ACTIVE" ? "Active" : "Pending"}
                </span>
              </div>
            ))}
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
              const childProgress = progress.find((p) =>
                contracts.some(
                  (c) => c.student.studentName === child.studentName && c.id === p.contractId,
                ),
              );
              const prog = childProgress?.quizScore ? `${childProgress.quizScore}%` : "—";
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
                        style={{ width: prog === "—" ? "0%" : prog }}
                      />
                    </div>
                    <span className="text-xs font-bold text-teal-600">{prog}</span>
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
