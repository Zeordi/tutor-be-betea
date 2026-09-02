"use client";

import { useState } from "react";

export default function ParentProgressPage() {
  const [child, setChild] = useState("Kidane");

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Progress Reports</h2>
        <div className="flex gap-2">
          {["Kidane", "Meron"].map((c) => (
            <button
              key={c}
              onClick={() => setChild(c)}
              className={`rounded-xl px-4 py-1.5 text-sm font-semibold transition-all ${
                child === c
                  ? "bg-teal-600 text-white"
                  : "border border-slate-200 text-slate-500 dark:border-slate-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Overall", "89%", "↑4%", "📊"],
          ["Sessions", "32", "This month", "📚"],
          ["Attendance", "98%", "On time", "⏰"],
          ["Homework", "90%", "Submitted", "✅"],
        ].map(([l, v, s, i]) => (
          <div
            key={l}
            className="rounded-2xl border border-slate-100 bg-white p-4 text-center dark:border-slate-800 dark:bg-[#112240]"
          >
            <p className="mb-1 text-2xl">{i}</p>
            <p className="text-xl font-extrabold text-teal-600">{v}</p>
            <p className="text-xs text-slate-500">{l}</p>
            <p className="text-[10px] text-slate-400">{s}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-white">Subject Performance</h3>
          {[["Mathematics", "92%"], ["Physics", "85%"], ["English", "89%"], ["Chemistry", "83%"]].map(
            ([sub, pct]) => (
              <div key={sub} className="mb-3">
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{sub}</span>
                  <span className="font-bold text-teal-600">{pct}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400"
                    style={{ width: pct }}
                  />
                </div>
              </div>
            )
          )}
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <h3 className="font-bold text-slate-800 dark:text-white">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {[
              "Strong upward trend in algebra over past 4 weeks.",
              "Consistent homework completion improving understanding.",
              `Focus on Physics word problems — ${child} struggles with unit conversion.`,
              "Recommend increasing session frequency before exams.",
            ].map((tip) => (
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