"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type Application = {
  id: string;
  teacher: { fullName: string; avatarUrl: string | null };
  proposedRate: number | null;
  status: string;
  createdAt: string;
};

type ParentJob = {
  id: string;
  title?: string;
  subjects: string[];
  student: { studentName: string; gradeLevel: string };
  monthlyBudget: number;
  isUrgentBoost: boolean;
  status: string;
  applications: Application[];
  createdAt: string;
};

const TABS = ["My Jobs", "Applications", "Hired"] as const;
type Tab = (typeof TABS)[number];

const STATUS_COPY: Record<string, string> = {
  OPEN: "Active",
  FILLED: "Hired",
  CLOSED: "Closed",
  EXPIRED: "Expired",
};

export default function ParentJobsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState<ParentJob[]>([]);
  const [tab, setTab] = useState<Tab>("My Jobs");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<ParentJob[]>(paths.jobsMine)
      .then((data) => {
        if (!cancelled) setJobs(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load jobs");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const applications = jobs
    .flatMap((j) => j.applications)
    .filter((a) => a.status !== "ACCEPTED");

  const hired = jobs
    .filter((j) => j.status === "FILLED")
    .map((j) => ({
      id: j.id,
      teacherName:
        j.applications.find((a) => a.status === "ACCEPTED")?.teacher.fullName ||
        "Unknown",
      subject: j.subjects.join(", "),
      student: j.student.studentName,
    }));

  const statusPill = (status: string) => {
    const copy = STATUS_COPY[status] || status.toLowerCase();
    const isOpen = status === "OPEN";
    const isFilled = status === "FILLED";
    return (
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
          isOpen
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
            : isFilled
              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        }`}
      >
        {copy}
      </span>
    );
  };

  const applicationStatusPill = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending") {
      return (
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          New
        </span>
      );
    }
    if (s === "shortlisted" || s === "reviewed") {
      return (
        <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
          {status}
        </span>
      );
    }
    return (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">My Jobs</h2>
        <Link
          href="/parent/jobs/create"
          className="rounded-xl bg-teal-600 px-4 py-2 text-center text-sm font-bold text-white"
        >
          + Post Job
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-1.5 text-sm font-semibold transition-all ${
              tab === t
                ? "bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-600/20 dark:bg-teal-900/30 dark:text-teal-300"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-800"
            />
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {tab === "My Jobs" && (
            <div className="space-y-3">
              {jobs.length === 0 && (
                <p className="text-sm text-slate-400">No jobs posted yet.</p>
              )}
              {jobs.map((j) => (
                <div
                  key={j.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-[#112240] sm:flex-row sm:items-center"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xl dark:bg-teal-900/30">
                    📚
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                        {j.subjects.join(", ")} · {j.student.gradeLevel}
                      </p>
                      {j.isUrgentBoost && (
                        <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                          🚀 Boosted
                        </span>
                      )}
                      {statusPill(j.status)}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      👧 {j.student.studentName} · 💰 {Number(j.monthlyBudget).toLocaleString()} ETB/hr · 📋 {j.applications.length} applicants
                    </p>
                  </div>
                  <Link
                    href={`/parent/jobs/${j.id}`}
                    className="shrink-0 rounded-xl border border-slate-200 px-3 py-1.5 text-center text-xs font-bold text-slate-600 transition hover:border-teal-600 hover:text-teal-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:text-teal-300"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}

          {tab === "Applications" && (
            <div className="space-y-3">
              {applications.length === 0 && (
                <p className="text-sm text-slate-400">No applications yet.</p>
              )}
              {applications.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-[#112240] sm:flex-row sm:items-center"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
                    {a.teacher.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                        {a.teacher.fullName}
                      </p>
                      {applicationStatusPill(a.status)}
                    </div>
                    <p className="text-xs text-slate-400">
                      {a.proposedRate ? `${a.proposedRate} ETB/hr` : "Rate not specified"} · ⭐ {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      className="rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-bold text-white"
                    >
                      Hire
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "Hired" && (
            <div className="space-y-3">
              {hired.length === 0 && (
                <p className="text-sm text-slate-400">No hired tutors yet.</p>
              )}
              {hired.map((h) => (
                <div
                  key={h.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-[#112240] sm:flex-row sm:items-center"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
                    {h.teacherName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {h.teacherName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {h.subject} · {h.student}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30">
                      ✓ Active Contract
                    </span>
                  </div>
                  <Link
                    href="/parent/contracts"
                    className="shrink-0 rounded-xl bg-teal-600 px-3 py-1.5 text-center text-xs font-bold text-white"
                  >
                    View Contract
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
