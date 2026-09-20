"use client";

import { useEffect, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

type ChildProgress = {
  childId: string;
  studentName: string;
  gradeLevel: string;
  overallScore: number;
  sessionsThisMonth: number;
  attendancePct: number;
  homeworkPct: number;
  subjects: { name: string; score: number }[];
  aiInsights: string[];
};

export default function ParentProgressPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [children, setChildren] = useState<ChildProgress[]>([]);
  const [child, setChild] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<ChildProgress[]>(paths.progressMine)
      .then((data) => {
        if (!cancelled) {
          setChildren(data || []);
          if (data && data.length > 0 && !child) {
            setChild(data[0].studentName);
          }
        }
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
  }, []);

  const selected = children.find((c) => c.studentName === child) || children[0];

  if (loading) {
    return (
      <div className="space-y-5 p-6">
        <div className="h-6 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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

  if (!selected) {
    return (
      <div className="p-6">
        <p className="text-sm text-[var(--secondary)]">No progress data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Progress Reports</h2>
        <div className="flex gap-2">
          {children.map((c) => (
            <button
              key={c.childId}
              onClick={() => setChild(c.studentName)}
              className={`rounded-xl px-4 py-1.5 text-sm font-semibold transition-all ${
                child === c.studentName
                  ? "bg-teal-600 text-white"
                  : "border border-slate-200 text-slate-500 dark:border-slate-700"
              }`}
            >
              {c.studentName}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center dark:border-slate-800 dark:bg-[#112240]">
          <p className="mb-1 text-2xl">📊</p>
          <p className="text-xl font-extrabold text-teal-600">{selected.overallScore}%</p>
          <p className="text-xs text-slate-500">Overall</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center dark:border-slate-800 dark:bg-[#112240]">
          <p className="mb-1 text-2xl">📚</p>
          <p className="text-xl font-extrabold text-teal-600">{selected.sessionsThisMonth}</p>
          <p className="text-xs text-slate-500">Sessions</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center dark:border-slate-800 dark:bg-[#112240]">
          <p className="mb-1 text-2xl">⏰</p>
          <p className="text-xl font-extrabold text-teal-600">{selected.attendancePct}%</p>
          <p className="text-xs text-slate-500">Attendance</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center dark:border-slate-800 dark:bg-[#112240]">
          <p className="mb-1 text-2xl">✅</p>
          <p className="text-xl font-extrabold text-teal-600">{selected.homeworkPct}%</p>
          <p className="text-xs text-slate-500">Homework</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">Subject Performance</h3>
          {selected.subjects.map((sub) => (
            <div key={sub.name} className="mb-3">
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">{sub.name}</span>
                <span className="font-bold text-teal-600">{sub.score}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400"
                  style={{ width: `${sub.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <h3 className="font-bold text-slate-800 dark:text-white">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {selected.aiInsights.map((tip) => (
              <div
                key={tip}
                className="flex gap-2 rounded-xl bg-teal-50 p-2 dark:bg-teal-900/20"
              >
                <span className="mt-0.5 text-sm text-teal-500">💡</span>
                <p className="text-xs text-slate-600 dark:text-slate-400">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
