"use client";

import { useEffect, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

type ScheduleSlot = {
  day: string;
  slots: string[];
};

type BlockedDate = {
  id: string;
  dateRange: string;
  reason: string;
};

type Package = {
  id: string;
  name: string;
  sessions: number;
  hrs: number;
  total: number;
  popular: boolean;
};

type Availability = {
  weeklySchedule: ScheduleSlot[];
  blockedDates: BlockedDate[];
  packages: Package[];
  weeklyHours: number;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TeacherAvailabilityPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"weekly" | "packages">("weekly");
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [blocked, setBlocked] = useState<BlockedDate[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [weeklyHours, setWeeklyHours] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<Availability>(paths.availabilityMine)
      .then((data) => {
        if (!cancelled) {
          if (data?.weeklySchedule) setSchedule(data.weeklySchedule);
          else setSchedule(DAYS.map((day) => ({ day, slots: [] })));
          if (data?.blockedDates) setBlocked(data.blockedDates);
          if (data?.packages) setPackages(data.packages);
          if (typeof data?.weeklyHours === "number") setWeeklyHours(data.weeklyHours);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load availability");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const save = async () => {
    try {
      await apiFetch(paths.availabilitySlots, {
        method: "PUT",
        body: JSON.stringify({
          slots: schedule,
          blockedDates: blocked,
        }),
      });
      await apiFetch(paths.availabilityPackages, {
        method: "POST",
        body: JSON.stringify({ packages }),
      });
      alert("Availability saved.");
    } catch (err: any) {
      alert(err.message || "Failed to save");
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 p-4 md:p-8">
        <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-10 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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
    <div className="space-y-5 p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white">Availability & Packages</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Weekly hours parents can book · package offers
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700"
        >
          Save
        </button>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-700">
        {([
          ["weekly", "📅 Weekly Hours"],
          ["packages", "📦 Packages"],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`relative flex-1 py-3 text-sm font-bold ${
              tab === id ? "text-teal-700 dark:text-teal-300" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {label}
            {tab === id && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-teal-600" />
            )}
          </button>
        ))}
      </div>

      {tab === "weekly" ? (
        <>
          <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-xs font-semibold text-teal-800 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-300">
            ⏱ Weekly capacity: <strong>{weeklyHours} hrs</strong> · Max recommended: 30 hrs/week
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Recurring Schedule</p>
            <div className="space-y-3">
              {schedule.map((d) => (
                <div
                  key={d.day}
                  className="flex flex-wrap items-start gap-3 border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${
                      d.slots.length
                        ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {d.day}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    {d.slots.length > 0 ? (
                      <>
                        {d.slots.map((s) => (
                          <span
                            key={s}
                            className="rounded-lg border border-teal-200 bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300"
                          >
                            {s}
                          </span>
                        ))}
                        <button
                          type="button"
                          className="text-xs font-bold text-teal-600"
                        >
                          + Add
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="text-xs text-slate-500 dark:text-slate-400"
                      >
                        + Add slots
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Block Dates</p>
              <button
                type="button"
                className="text-xs font-bold text-teal-600"
              >
                + Block
              </button>
            </div>
            {blocked.length > 0 ? (
              <div className="space-y-2">
                {blocked.map((b) => (
                  <div key={b.id} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{b.dateRange}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{b.reason}</p>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-slate-400 hover:text-red-500"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No blocked dates.</p>
            )}
          </div>
        </>
      ) : (
        <>
          {packages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-[#112240]">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No packages yet</p>
              <p className="mt-1 text-xs text-slate-400">Create a package to offer structured sessions.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {packages.map((p) => (
                <div
                  key={p.id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-[#112240] ${
                    p.popular
                      ? "border-teal-600 dark:border-teal-500"
                      : "border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white">{p.name}</p>
                    {p.popular && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="mb-3 grid grid-cols-3 gap-2">
                    {[
                      [`${p.sessions}`, "Sessions"],
                      [`${p.hrs}h`, "Per session"],
                      [p.total.toLocaleString(), "ETB total"],
                    ].map(([v, l]) => (
                      <div
                        key={l}
                        className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-900/60"
                      >
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white">{v}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{l}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mb-3 text-[10px] text-slate-500 dark:text-slate-400">
                    ✅ Valid 60 days · Escrow per session · Telebirr / CBE Birr
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={`flex-1 rounded-xl py-2.5 text-xs font-bold ${
                        p.popular
                          ? "bg-teal-600 text-white"
                          : "border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {p.popular ? "Active ✓" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            className="w-full rounded-2xl border-2 border-dashed border-slate-200 py-4 text-sm font-bold text-slate-500 transition hover:border-teal-400 hover:text-teal-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-teal-500"
          >
            + Create Custom Package
          </button>
        </>
      )}
    </div>
  );
}
