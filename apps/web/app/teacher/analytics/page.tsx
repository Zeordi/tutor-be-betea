"use client";

import { useEffect, useState } from "react";

type Analytics = {
  profileViews: number;
  jobMatches: number;
  applyRate: number;
  rehireRate: number;
  subjectDemand: { name: string; pct: number }[];
  earningsForecast: { label: string; amount: string }[];
};

const DEMO: Analytics = {
  profileViews: 0,
  jobMatches: 0,
  applyRate: 0,
  rehireRate: 0,
  subjectDemand: [],
  earningsForecast: [],
};

export default function TeacherAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setData(null);

    setTimeout(() => {
      if (!cancelled) {
        setData(DEMO);
        setLoading(false);
      }
    }, 0);

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-5 p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
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

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-sm text-[var(--secondary)]">No analytics data available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6">
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Analytics & Insights</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          [String(data.profileViews), "Profile Views", "This month"],
          [String(data.jobMatches), "Job Matches", "Active"],
          [`${data.applyRate}%`, "Apply Rate", "Applied/matched"],
          [`${data.rehireRate}%`, "Rehire Rate", "Past clients"],
        ].map(([v, l, s]) => (
          <div
            key={l}
            className="rounded-2xl border border-slate-100 bg-white p-4 text-center dark:border-slate-800 dark:bg-[#112240]"
          >
            <p className="text-2xl font-extrabold text-teal-600">{v}</p>
            <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-300">{l}</p>
            <p className="text-[10px] text-slate-400">{s}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">Subject Demand</h3>
          <div className="space-y-3">
            {(data.subjectDemand || []).map((sub) => (
              <div key={sub.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{sub.name}</span>
                  <span className="font-bold text-teal-600">{sub.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400"
                    style={{ width: `${sub.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">Earnings Forecast</h3>
          <div className="space-y-2">
            {(data.earningsForecast || []).map((f) => (
              <div
                key={f.label}
                className="flex justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
              >
                <span className="text-xs text-slate-600 dark:text-slate-400">{f.label}</span>
                <span className="text-xs font-extrabold text-teal-600">{f.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
