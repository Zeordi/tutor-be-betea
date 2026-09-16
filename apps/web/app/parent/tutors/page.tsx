"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type Teacher = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  subjects: string[];
  grades: string[];
  hourlyRate: number;
  monthlyRate: number;
  rating: number;
  totalReviews: number;
  badgeTier: string | null;
  isIdVerified: boolean;
  isEduVerified: boolean;
  trustBadges: string[];
  subCity: string | null;
};

export default function ParentFindTutorsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tutors, setTutors] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<Teacher[]>(paths.teachers)
      .then((data) => {
        if (!cancelled) setTutors(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load tutors");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = tutors.filter((t) => {
    const term = search.toLowerCase();
    return (
      t.fullName.toLowerCase().includes(term) ||
      t.subjects.some((s) => s.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Find Tutors</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {filtered.length} available
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 dark:border-slate-700 dark:bg-[#112240]">
          <span>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, subject, location..."
            className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400 dark:text-slate-300"
          />
        </div>
        <select className="rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none dark:border-slate-700 dark:bg-[#112240] dark:text-slate-300">
          <option>All Subjects</option>
          <option>Mathematics</option>
          <option>Physics</option>
          <option>English</option>
          <option>Chemistry</option>
        </select>
        <select className="rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none dark:border-slate-700 dark:bg-[#112240] dark:text-slate-300">
          <option>Any Grade</option>
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i}>Grade {i + 1}</option>
          ))}
        </select>
        <button className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white">🎚 Filters</button>
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl border border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-800"
            />
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#112240]"
            >
              <div className="mb-3 flex items-start gap-3">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
                    {t.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{t.fullName}</p>
                  <p className="text-xs text-slate-500">{t.subjects.join(", ")}</p>
                  <p className="mt-0.5 text-[10px] text-amber-500">
                    {"★".repeat(Math.round(t.rating))}{" "}
                    <span className="text-slate-400">{t.rating.toFixed(1)}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-teal-600">{t.hourlyRate}</p>
                  <p className="text-[10px] text-slate-400">ETB/hr</p>
                </div>
              </div>

              <div className="mb-3 flex flex-wrap gap-1.5">
                {t.isIdVerified && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    🛡️ ID
                  </span>
                )}
                {t.isEduVerified && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    🎓 Degree
                  </span>
                )}
                {t.badgeTier && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    🥇 {t.badgeTier}
                  </span>
                )}
                {t.subCity && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800">
                    📍 {t.subCity}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/parent/tutors/${t.id}`}
                  className="flex-1 rounded-xl bg-teal-600 py-2 text-center text-xs font-bold text-white"
                >
                  Book
                </Link>
                <Link
                  href={`/parent/tutors/${t.id}`}
                  className="flex-1 rounded-xl border border-teal-600 py-2 text-center text-xs font-bold text-teal-600"
                >
                  Profile
                </Link>
                <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 dark:border-slate-700">
                  ❤
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
              No tutors match your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
