"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch, paths } from "@/lib/api";

type SubjectScore = {
  name: string;
  score: number;
  prevScore: number;
  homeworkPct: number;
};

type ProgressDetail = {
  contractId: string;
  studentName: string;
  gradeLevel: string;
  subject: string;
  curriculum: string;
  sessionNumber: number;
  sessionDate: string;
  overallScore: number;
  attendancePct: number;
  homeworkPct: number;
  subjects: SubjectScore[];
  strengths: string[];
  focusAreas: string[];
  aiInsight: string;
  aiInsightAm: string;
};

export default function ParentProgressDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<ProgressDetail | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<ProgressDetail>(paths.progressGet(id))
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load progress");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="h-56 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="h-48 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6">
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

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-sm text-[var(--secondary)]">No progress data available.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/parent/progress"
          className="text-sm font-semibold text-[var(--secondary)] hover:text-[var(--primary)]"
        >
          ← Progress
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Progress Report</h1>
          <p className="text-sm text-[var(--secondary)]">
            {data.studentName} · Session #{data.sessionNumber} ·{" "}
            {new Date(data.sessionDate).toLocaleDateString()} · #{data.contractId}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] font-extrabold text-white">
            {data.studentName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-[var(--foreground)]">{data.studentName}</p>
            <p className="text-sm text-[var(--secondary)]">
              Grade {data.gradeLevel} · {data.subject} · {data.curriculum}
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            On Track
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            [data.overallScore + "%", "Mastery"],
            [data.attendancePct + "%", "Attend."],
            [data.homeworkPct + "%", "Homework"],
            [data.sessionNumber, "Sessions"],
          ].map(([v, l]) => (
            <div
              key={l as string}
              className="rounded-xl bg-[var(--muted)] p-3 text-center"
            >
              <p className="text-sm font-extrabold text-[var(--primary)]">{v}</p>
              <p className="text-[10px] text-[var(--secondary)]">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-[#0f766e] p-5 text-white">
        <div className="mb-2 flex items-center gap-2">
          <span>🤖</span>
          <span className="text-xs font-extrabold tracking-wide">AI-GENERATED INSIGHT</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
            Session #{data.sessionNumber}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-white/90">{data.aiInsight}</p>
        {data.aiInsightAm && (
          <p className="mt-2 text-xs text-white/65">{data.aiInsightAm}</p>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">
          SUBJECT SCORES · VS LAST MONTH
        </p>
        <div className="space-y-4">
          {data.subjects.map((s) => (
            <div key={s.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-semibold text-[var(--foreground)]">{s.name}</span>
                <span className="text-[var(--secondary)]">
                  Was {s.prevScore}%{" "}
                  <span className="font-extrabold text-emerald-500">↑ {s.score}%</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)]"
                  style={{ width: `${s.score}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-[var(--secondary)]">HW completion: {s.homeworkPct}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="mb-2 text-sm font-bold text-emerald-600">✅ Strengths</p>
          {(data.strengths || []).map((x) => (
            <p key={x} className="mb-1 text-sm text-[var(--foreground)]">
              • {x}
            </p>
          ))}
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="mb-2 text-sm font-bold text-amber-600">⚠ Focus Areas</p>
          {(data.focusAreas || []).map((x) => (
            <p key={x} className="mb-1 text-sm text-[var(--foreground)]">
              • {x}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-extrabold text-white"
        >
          ✅ Approve Report
        </button>
        <Link
          href="/parent/chat/1"
          className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-bold text-[var(--secondary)]"
        >
          💬 Ask Tutor
        </Link>
      </div>
    </div>
  );
}
