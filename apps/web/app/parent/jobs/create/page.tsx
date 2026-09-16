"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, paths } from "@/lib/api";

type ChildOption = {
  id: string;
  studentName: string;
  gradeLevel: string;
};

type Subject = "Mathematics" | "Physics" | "English" | "Chemistry" | "Biology" | "History" | "Geography";

export default function PostJobPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [children, setChildren] = useState<ChildOption[]>([]);
  const [childrenLoading, setChildrenLoading] = useState(true);

  const [subject, setSubject] = useState<Subject>("Mathematics");
  const [gradeLevel, setGradeLevel] = useState("");
  const [studentId, setStudentId] = useState("");
  const [budget, setBudget] = useState("");
  const [sessionType, setSessionType] = useState("Home Visit");
  const [description, setDescription] = useState("");
  const [genderPreference, setGenderPreference] = useState("Any");
  const [preferredDays, setPreferredDays] = useState<string[]>([]);
  const [isUrgentBoost, setIsUrgentBoost] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setChildrenLoading(true);

    apiFetch<ChildOption[]>(paths.children)
      .then((data) => {
        if (!cancelled) setChildren(data || []);
      })
      .catch(() => {
        if (!cancelled) setChildren([]);
      })
      .finally(() => {
        if (!cancelled) setChildrenLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleDay = (d: string) => {
    setPreferredDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const payload: Record<string, unknown> = {
        studentId: studentId || children[0]?.id,
        subjects: [subject],
        monthlyBudget: Number(budget) || 0,
        description: description || null,
        preferredGender: genderPreference === "Any" ? null : genderPreference,
        subCity: null,
        isUrgentBoost: isUrgentBoost,
      };

      await apiFetch(paths.jobsCreate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      router.push("/parent/jobs");
    } catch (err: any) {
      setError(err.message || "Failed to publish job");
      setLoading(false);
    }
  };

  const selectedChild = children.find((c) => c.id === studentId) || children[0];

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
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as Subject)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>English</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                    <option>History</option>
                    <option>Geography</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Grade Level *</label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <option value="">Select grade</option>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i} value={`Grade ${i + 1}`}>Grade {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Child</label>
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    disabled={childrenLoading}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <option value="">
                      {childrenLoading ? "Loading children…" : "Select child"}
                    </option>
                    {children.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.studentName} ({c.gradeLevel})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Budget (ETB/hr) *</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
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
                        onClick={() => setSessionType(t)}
                        className={`flex-1 rounded-xl border py-2 text-sm font-semibold ${
                          sessionType === t
                            ? "border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                            : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400"
                        }`}
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                        onClick={() => setGenderPreference(g)}
                        className={`flex-1 rounded-xl border py-2 text-sm ${
                          genderPreference === g
                            ? "border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                            : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400"
                        }`}
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
                        onClick={() => toggleDay(d)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                          preferredDays.includes(d)
                            ? "border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                            : "border-slate-200 text-slate-500 hover:border-teal-500 hover:text-teal-600 dark:border-slate-700"
                        }`}
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
                  <button
                    type="button"
                    onClick={() => setIsUrgentBoost(!isUrgentBoost)}
                    className={`relative h-6 w-10 rounded-full transition ${
                      isUrgentBoost ? "bg-teal-500" : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                        isUrgentBoost ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 p-3 dark:border-teal-800 dark:bg-teal-900/20">
                  <div>
                    <p className="text-sm font-bold text-teal-700 dark:text-teal-300">🚀 Boost This Job</p>
                    <p className="text-xs text-teal-600 dark:text-teal-400">Feature at top of feed for 7 days (+500 ETB)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsBoosted(!isBoosted)}
                    className={`relative h-6 w-10 rounded-full transition ${
                      isBoosted ? "bg-teal-500" : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                        isBoosted ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="font-bold text-slate-800 dark:text-white">Review & Publish</h3>
              <div className="space-y-3">
                {[
                  ["Subject", subject],
                  ["Child", selectedChild ? `${selectedChild.studentName} (${selectedChild.gradeLevel})` : "—"],
                  ["Budget", `${budget} ETB/hr`],
                  ["Session Type", sessionType],
                  ["Boosts", `${isUrgentBoost ? "⚡ Urgent" : ""} ${isBoosted ? "🚀 Featured" : ""}`.trim() || "None"],
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
                  <span className="text-teal-600">
                    {isUrgentBoost || isBoosted ? "650" : "0"} ETB (one-time)
                  </span>
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

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
                else handleSubmit();
              }}
              disabled={loading}
              className="flex-1 rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white disabled:opacity-70"
            >
              {loading
                ? "Publishing…"
                : step === 3
                  ? "🚀 Publish Job"
                  : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
