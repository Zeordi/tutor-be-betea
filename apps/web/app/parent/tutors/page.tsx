"use client";

import { useState } from "react";
import Link from "next/link";

const TUTORS = [
  { id: "1", name: "Selamawit Tadesse", subjects: "Math · Physics", rate: 450, rating: 4.9, sessions: 128, idv: true, deg: true, gold: true, dist: "1.2 km", available: true },
  { id: "2", name: "Bereket Solomon", subjects: "Physics · Chemistry", rate: 500, rating: 4.8, sessions: 96, idv: true, deg: true, gold: false, dist: "2.1 km", available: true },
  { id: "3", name: "Tigist Haile", subjects: "Math · Stats", rate: 380, rating: 4.7, sessions: 74, idv: true, deg: false, gold: false, dist: "3.4 km", available: false },
  { id: "4", name: "Dawit Kebede", subjects: "English · Literature", rate: 350, rating: 4.6, sessions: 52, idv: true, deg: true, gold: false, dist: "1.8 km", available: true },
  { id: "5", name: "Meseret Alemu", subjects: "Biology · Chemistry", rate: 420, rating: 4.8, sessions: 88, idv: true, deg: true, gold: true, dist: "2.8 km", available: true },
  { id: "6", name: "Yonas Girma", subjects: "Math · Grade 12", rate: 480, rating: 4.9, sessions: 112, idv: true, deg: true, gold: true, dist: "0.9 km", available: true },
];

export default function ParentFindTutorsPage() {
  const [search, setSearch] = useState("");

  const filtered = TUTORS.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subjects.toLowerCase().includes(search.toLowerCase())
  );

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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#112240]"
          >
            <div className="mb-3 flex items-start gap-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
                  {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-[#112240] ${
                    t.available ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{t.name}</p>
                <p className="text-xs text-slate-500">{t.subjects}</p>
                <p className="mt-0.5 text-[10px] text-amber-500">
                  {"★".repeat(Math.round(t.rating))} <span className="text-slate-400">{t.rating}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-teal-600">{t.rate}</p>
                <p className="text-[10px] text-slate-400">ETB/hr</p>
              </div>
            </div>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {t.idv && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  🛡️ ID
                </span>
              )}
              {t.deg && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  🎓 Degree
                </span>
              )}
              {t.gold && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  🥇 Gold
                </span>
              )}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800">
                📍 {t.dist}
              </span>
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
      </div>
    </div>
  );
}