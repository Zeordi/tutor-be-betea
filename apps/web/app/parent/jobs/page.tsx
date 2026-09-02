"use client";

import { useState } from "react";
import Link from "next/link";

export default function ParentJobsPage() {
  const [tab, setTab] = useState("My Jobs");
  const tabs = ["My Jobs", "Applications", "Hired"];

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">My Jobs</h2>
        <Link
          href="/parent/jobs/create"
          className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white"
        >
          + Post Job
        </Link>
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-1.5 text-sm font-semibold transition-all ${
              tab === t
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "My Jobs" && (
        <div className="space-y-3">
          {[
            { title: "Grade 10 Math Tutor", child: "Kidane M.", apps: 8, budget: "400–500 ETB/hr", status: "active", boost: true },
            { title: "Grade 8 English Tutor", child: "Meron H.", apps: 3, budget: "300–400 ETB/hr", status: "active", boost: false },
            { title: "Grade 10 Physics", child: "Kidane M.", apps: 12, budget: "450 ETB/hr", status: "hired", boost: false },
          ].map((j) => (
            <div
              key={j.title}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-xl dark:bg-teal-900/30">
                📚
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{j.title}</p>
                  {j.boost && (
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                      🚀 Boosted
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      j.status === "active"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    }`}
                  >
                    {j.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  👧 {j.child} · 💰 {j.budget} · 📋 {j.apps} applicants
                </p>
              </div>
              <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                View
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "Applications" && (
        <div className="space-y-3">
          {[
            { name: "Selamawit Tadesse", job: "Grade 10 Math", rate: 450, status: "new", rating: 4.9 },
            { name: "Yonas Girma", job: "Grade 10 Math", rate: 480, status: "reviewed", rating: 4.8 },
            { name: "Tigist Haile", job: "Grade 8 English", rate: 350, status: "new", rating: 4.7 },
          ].map((a) => (
            <div
              key={a.name}
              className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
                  {a.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{a.name}</p>
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-900/30">
                      {a.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {a.job} · {a.rate} ETB/hr · ⭐ {a.rating}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-bold text-white">Hire</button>
                  <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-700">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Hired" && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-[#112240]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
              ST
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800 dark:text-white">Selamawit Tadesse</p>
              <p className="text-xs text-slate-400">Grade 10 Math · Contract Active</p>
              <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30">
                ✓ Active Contract
              </span>
            </div>
            <Link href="/parent/contracts" className="rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-bold text-white">
              View Contract
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}