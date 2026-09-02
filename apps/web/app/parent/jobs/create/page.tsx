"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Post a Job</h2>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-12 rounded-full ${s <= step ? "bg-teal-500" : "bg-slate-200 dark:bg-slate-700"}`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-400">Step {step} of 3</span>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-[#112240]">
          {step === 1 && (
            <>
              <h3 className="font-bold text-slate-800 dark:text-white">Job Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Subject *</label>
                  <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>English</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Grade Level *</label>
                  <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i}>Grade {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Child</label>
                  <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <option>Kidane M. (Gr. 10)</option>
                    <option>Meron H. (Gr. 8)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Budget (ETB/hr) *</label>
                  <input
                    type="number"
                    placeholder="400"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Session Type</label>
                  <div className="flex gap-2">
                    {["Home Visit", "Online", "Either"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        className="flex-1 rounded-xl border border-teal-600 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe what you need..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="font-bold text-slate-800 dark:text-white">Requirements & Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Gender Preference</label>
                  <div className="flex gap-2">
                    {["Any", "Female", "Male"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        className="flex-1 rounded-xl border border-slate-200 py-2 text-sm text-slate-600 hover:border-teal-500 dark:border-slate-700 dark:text-slate-400"
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Preferred Days</label>
                  <div className="flex flex-wrap gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:border-teal-500 hover:text-teal-600 dark:border-slate-700"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                  <div>
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-300">⚡ Mark as Urgent</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">Get applications faster (+150 ETB)</p>
                  </div>
                  <div className="h-6 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 p-3 dark:border-teal-800 dark:bg-teal-900/20">
                  <div>
                    <p className="text-sm font-bold text-teal-700 dark:text-teal-300">🚀 Boost This Job</p>
                    <p className="text-xs text-teal-600 dark:text-teal-400">Feature at top of feed for 7 days (+500 ETB)</p>
                  </div>
                  <div className="relative h-6 w-10 rounded-full bg-teal-500">
                    <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow" />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="font-bold text-slate-800 dark:text-white">Review & Publish</h3>
              <div className="space-y-3">
                {[
                  ["Subject", "Mathematics — Grade 10"],
                  ["Child", "Kidane M."],
                  ["Budget", "450 ETB/hr"],
                  ["Session Type", "Home Visit or Online"],
                  ["Boosts", "⚡ Urgent + 🚀 Featured"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between border-b border-slate-100 py-2 text-sm dark:border-slate-800"
                  >
                    <span className="text-slate-500">{k}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 text-sm font-bold">
                  <span className="text-slate-800 dark:text-white">Total Cost</span>
                  <span className="text-teal-600">650 ETB (one-time)</span>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (step < 3) setStep(step + 1);
                else router.push("/parent/jobs");
              }}
              className="flex-1 rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white"
            >
              {step === 3 ? "🚀 Publish Job" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}