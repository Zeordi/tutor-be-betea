"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

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

export default function TeacherJobsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selected, setSelected] = useState(0);
  const [modal, setModal] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<Job[]>(paths.jobsMine)
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

  const job = jobs[selected];

  const handleApply = async () => {
    setApplyLoading(true);
    try {
      await apiFetch("/applications", {
        method: "POST",
        body: JSON.stringify({ jobId: job.id }),
      });
      setModal(false);
    } catch (err: any) {
      alert(err.message || "Failed to apply");
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
          <div className="h-96 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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
    <div>
      <h1 className="mb-6 text-2xl font-black text-[var(--foreground)]">Job Board</h1>
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <span className="font-bold text-[var(--foreground)]">{jobs.length} Open</span>
            <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-[var(--primary)] dark:bg-teal-950/40">
              Matching you
            </span>
          </div>
          {jobs.map((j, i) => (
            <button
              key={j.id}
              type="button"
              onClick={() => setSelected(i)}
              className={`w-full border-b border-[var(--border)] px-4 py-4 text-left ${
                selected === i ? "bg-teal-50 dark:bg-teal-950/30" : ""
              }`}
            >
              <div className="mb-1 flex justify-between gap-2">
                <span className="font-bold text-[var(--foreground)]">{j.title}</span>
                {j.urgency === "Urgent" && (
                  <span className="text-[10px] font-bold text-red-500">🔴 Urgent</span>
                )}
              </div>
              <p className="mb-2 text-xs text-[var(--secondary)]">
                {j.family} · {j.loc} · {j.cur}
              </p>
              <div className="flex gap-2">
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-[var(--primary)] dark:bg-teal-950/40">
                  {j.budget}
                </span>
                <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[11px] text-[var(--secondary)]">
                  {j.hrs}
                </span>
              </div>
            </button>
          ))}
        </div>

        {job && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-[var(--foreground)]">{job.title}</h2>
                <p className="text-sm text-[var(--secondary)]">
                  {job.family} · {job.loc} · {job.cur}
                </p>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700 dark:bg-amber-950/40">
                {job.id} · {job.posted}
              </span>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-4">
                <div className="mb-1 text-xl">💰</div>
                <p className="text-[11px] text-[var(--secondary)]">Budget</p>
                <p className="font-bold text-[var(--foreground)]">{job.budget}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-4">
                <div className="mb-1 text-xl">⏰</div>
                <p className="text-[11px] text-[var(--secondary)]">Hours</p>
                <p className="font-bold text-[var(--foreground)]">{job.hrs}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-4">
                <div className="mb-1 text-xl">👨‍👩‍👧</div>
                <p className="text-[11px] text-[var(--secondary)]">Children</p>
                <p className="font-bold text-[var(--foreground)]">{job.children}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-4">
                <div className="mb-1 text-xl">📍</div>
                <p className="text-[11px] text-[var(--secondary)]">Location</p>
                <p className="font-bold text-[var(--foreground)]">{job.loc}</p>
              </div>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-[var(--secondary)]">
              {job.description || "No description provided."}
            </p>

            <ul className="mb-6 space-y-2 text-sm text-[var(--secondary)]">
              {(job.requirements || []).map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-[var(--primary)]">•</span> {r}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setModal(true)}
                className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white"
              >
                ⚡ Apply with 2 Connects
              </button>
              <Link
                href={`/teacher/jobs/${job.id}/apply`}
                className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-bold text-[var(--foreground)]"
              >
                Full apply form
              </Link>
            </div>
            <p className="mt-3 rounded-xl bg-teal-50 p-3 text-xs font-semibold text-[var(--primary)] dark:bg-teal-950/30">
              ⚡ 14 Connects remaining · applying costs 2
            </p>
          </div>
        )}
      </div>

      {modal && job && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="mb-4 text-lg font-black text-[var(--foreground)]">
              Apply: {job.title}
            </h3>
            <label className="mb-1 block text-xs font-bold uppercase text-[var(--secondary)]">
              Proposed rate
            </label>
            <input
              defaultValue={job.budget}
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
              ⚡ Uses 2 Connects (14 left). Cannot retract after submit.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setModal(false)}
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
