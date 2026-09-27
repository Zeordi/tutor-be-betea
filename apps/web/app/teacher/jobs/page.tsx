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
  } | null;
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

type Filters = {
  subjects: string[];
  areas: string[];
  urgencies: string[];
};

const INITIAL_FILTERS: Filters = {
  subjects: [],
  areas: [],
  urgencies: [],
};

export default function TeacherJobsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [connects, setConnects] = useState<number>(0);
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.allSettled([
      apiFetch<Job[]>(paths.jobsOpen),
      apiFetch<TeacherMe>(paths.usersMe),
    ]).then((results) => {
      if (cancelled) return;
      const jobsResult = results[0];
      const meResult = results[1];

      if (jobsResult.status === "fulfilled") {
        setJobs(jobsResult.value || []);
      } else if (jobsResult.status === "rejected") {
        setError(jobsResult.reason?.message || "Failed to load jobs");
      }

      if (meResult.status === "fulfilled") {
        setConnects(meResult.value?.teacherProfile?.connectsBalance ?? 0);
      }
    }).catch((err) => {
      if (!cancelled) setError(err.message || "Failed to load jobs");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  const subjects = useMemo(() => {
    const set = new Set(jobs.map((j) => j.family).filter(Boolean));
    return Array.from(set).sort();
  }, [jobs]);

  const areas = useMemo(() => {
    const set = new Set(jobs.map((j) => j.loc).filter(Boolean));
    return Array.from(set).sort();
  }, [jobs]);

  const urgencies = useMemo(() => {
    const set = new Set(jobs.map((j) => j.urgency).filter(Boolean));
    return Array.from(set).sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (filters.subjects.length > 0 && !filters.subjects.includes(job.family)) return false;
      if (filters.areas.length > 0 && !filters.areas.includes(job.loc)) return false;
      if (filters.urgencies.length > 0 && !filters.urgencies.includes(job.urgency)) return false;
      return true;
    });
  }, [jobs, filters]);

  const toggleFilter = (category: keyof Filters, value: string) => {
    setFilters((prev) => {
      const current = prev[category];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: next };
    });
  };

  const clearFilters = () => setFilters(INITIAL_FILTERS);

  const hasActiveFilters = filters.subjects.length > 0 || filters.areas.length > 0 || filters.urgencies.length > 0;

  const handleApply = async () => {
    if (!selectedJob) return;
    setApplyLoading(true);
    try {
      await apiFetch(paths.jobApply(selectedJob.id), {
        method: "POST",
        body: JSON.stringify({ coverNote: "" }),
      });
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to apply");
    } finally {
      setApplyLoading(false);
    }
  };

  const toggleSave = (jobId: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="flex gap-2">
          <div className="h-9 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">Available Jobs</h1>
          <p className="text-sm text-[var(--secondary)]">
            {filteredJobs.length} {filteredJobs.length === 1 ? "opportunity" : "opportunities"} available
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-xs font-bold text-[var(--foreground)]">
          <span>🔗</span>
          <span>Balance: {connects}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={clearFilters}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              hasActiveFilters
                ? "border-[var(--border)] bg-white text-[var(--foreground)] dark:bg-[#112240]"
                : "border-transparent text-[var(--secondary)]"
            }`}
          >
            All
          </button>
          {subjects.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => toggleFilter("subjects", subject)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                filters.subjects.includes(subject)
                  ? "border-[var(--primary)] bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                  : "border-[var(--border)] bg-white text-[var(--secondary)] dark:bg-[#112240]"
              }`}
            >
              {subject}
            </button>
          ))}
          {areas.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => toggleFilter("areas", area)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                filters.areas.includes(area)
                  ? "border-[var(--primary)] bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                  : "border-[var(--border)] bg-white text-[var(--secondary)] dark:bg-[#112240]"
              }`}
            >
              {area}
            </button>
          ))}
          {urgencies.map((urgency) => (
            <button
              key={urgency}
              type="button"
              onClick={() => toggleFilter("urgencies", urgency)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                filters.urgencies.includes(urgency)
                  ? "border-[var(--primary)] bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                  : "border-[var(--border)] bg-white text-[var(--secondary)] dark:bg-[#112240]"
              }`}
            >
              {urgency}
            </button>
          ))}
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-[#112240]">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No jobs match your filters</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-2 text-xs font-bold text-teal-600 hover:text-teal-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job) => {
            const isUrgent = job.urgency.toLowerCase() === "urgent";
            const isSaved = savedIds.has(job.id);

            return (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-[#112240]"
              >
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-lg font-black text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                    {job.family ? job.family.slice(0, 2).toUpperCase() : "JB"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate text-sm font-bold text-[var(--foreground)]">{job.title}</h3>
                      <button
                        type="button"
                        onClick={() => toggleSave(job.id)}
                        className={`shrink-0 text-lg leading-none ${
                          isSaved ? "text-amber-500" : "text-slate-300 hover:text-amber-500"
                        }`}
                        aria-label={isSaved ? "Unsave" : "Save"}
                      >
                        {isSaved ? "★" : "☆"}
                      </button>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {isUrgent && (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950/30">
                          🔴 Urgent
                        </span>
                      )}
                      <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-bold text-[var(--secondary)]">
                        {job.family}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  {job.loc && (
                    <span className="flex items-center gap-1">
                      📍 {job.loc}
                    </span>
                  )}
                  {job.budget && (
                    <span className="flex items-center gap-1">
                      💰 {job.budget}
                    </span>
                  )}
                  {job.hrs && (
                    <span className="flex items-center gap-1">
                      ⏰ {job.hrs}
                    </span>
                  )}
                  {job.children > 0 && (
                    <span className="flex items-center gap-1">
                      👨‍👩‍👧 {job.children}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400">{job.posted}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJob(job);
                      setModalOpen(true);
                    }}
                    className="rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[var(--primary-hover)]"
                  >
                    ⚡ Apply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="mb-4 text-lg font-black text-[var(--foreground)]">
              Apply: {selectedJob.title}
            </h3>
            <label className="mb-1 block text-xs font-bold uppercase text-[var(--secondary)]">
              Proposed rate
            </label>
            <input
              defaultValue={selectedJob.budget}
              className="mb-3 w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2.5 text-sm font-bold text-[var(--primary)]"
            />
            <label className="mb-1 block text-xs font-bold uppercase text-[var(--secondary)]">
              Cover note
            </label>
            <textarea
              rows={4}
              placeholder="Explain why you're a great fit..."
              className="mb-3 w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2.5 text-sm"
            />
            <p className="mb-4 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-800 dark:bg-amber-950/30">
              ⚡ Uses 2 Connects ({connects} left). Cannot retract after submit.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-xl border border-[var(--border)] py-2.5 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={applyLoading}
                className="flex-[2] rounded-xl bg-[var(--primary)] py-2.5 font-bold text-white disabled:opacity-70"
              >
                {applyLoading ? "Submitting…" : "Submit (2 Connects)"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
