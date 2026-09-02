"use client";

import { useState } from "react";

const FILTERS = ["All", "Math", "Physics", "English", "Home Visit", "Online", "Urgent"];
const JOBS = [
  { title: "Grade 12 Physics Tutor", area: "Bole", dist: "1.5 km", rate: 500, connects: 2, urgent: true, boost: true, grade: "12", subject: "Physics", sessions: "3x/week", applicants: 4 },
  { title: "Grade 10 Mathematics", area: "Kazanchis", dist: "2.3 km", rate: 450, connects: 2, urgent: false, boost: false, grade: "10", subject: "Math", sessions: "2x/week", applicants: 7 },
  { title: "Grade 9 Chemistry + Bio", area: "Piazza", dist: "4.1 km", rate: 420, connects: 2, urgent: false, boost: true, grade: "9", subject: "Science", sessions: "2x/week", applicants: 3 },
  { title: "Grade 11 English Writing", area: "CMC", dist: "5.2 km", rate: 380, connects: 1, urgent: false, boost: false, grade: "11", subject: "English", sessions: "1x/week", applicants: 9 },
];

export default function TeacherJobsPage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Available Jobs</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Balance:</span>
          <span className="font-bold text-teal-600">🔗 24 Connects</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === f
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-500 hover:text-slate-700 dark:bg-slate-800"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {JOBS.map((j) => (
          <div
            key={j.title}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#112240]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xl dark:bg-teal-900/30">
                📚
              </div>
              <div className="flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <p className="font-bold text-slate-800 dark:text-white">{j.title}</p>
                  {j.urgent && (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-900/30">
                      ⚡ Urgent
                    </span>
                  )}
                  {j.boost && (
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-900/30">
                      🚀 Featured
                    </span>
                  )}
                </div>
                <p className="mb-2 text-xs text-slate-400">
                  📍 {j.area} · {j.dist} · {j.rate} ETB/hr · {j.sessions} · {j.applicants} applicants
                </p>
                <p className="text-xs text-slate-500">
                  Grade {j.grade} · {j.subject}
                </p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <button className="rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-bold text-white">
                  Apply — 🔗{j.connects}
                </button>
                <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-700">
                  Save
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}