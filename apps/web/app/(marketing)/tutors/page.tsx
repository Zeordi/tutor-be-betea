"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Tutor = {
  id: string;
  name: string;
  sub: string;
  rate: number;
  rating: number;
  sessions: number;
  city: string;
  cur: string;
  emoji: string;
  avail: string;
  dist: string;
  badges: string[];
};

const ALL_TUTORS: Tutor[] = [
  {
    id: "1",
    name: "Berhane Alemu",
    sub: "Math & Physics",
    rate: 450,
    rating: 4.9,
    sessions: 312,
    city: "Bole",
    cur: "National",
    emoji: "👨🏾‍🏫",
    avail: "Today",
    dist: "1.2 km",
    badges: ["fayda", "degree", "gold"],
  },
  {
    id: "2",
    name: "Selamawit Bekele",
    sub: "Chemistry & Biology",
    rate: 500,
    rating: 5.0,
    sessions: 198,
    city: "Yeka",
    cur: "Cambridge",
    emoji: "👩🏾‍🔬",
    avail: "Tomorrow",
    dist: "3.4 km",
    badges: ["fayda", "degree", "elite"],
  },
  {
    id: "3",
    name: "Dawit Haile",
    sub: "English & Literature",
    rate: 380,
    rating: 4.8,
    sessions: 445,
    city: "Sarbet",
    cur: "Both",
    emoji: "👨🏿‍💼",
    avail: "Today",
    dist: "2.1 km",
    badges: ["fayda", "degree"],
  },
  {
    id: "4",
    name: "Fiyori Tesfaye",
    sub: "Mathematics",
    rate: 420,
    rating: 4.7,
    sessions: 267,
    city: "Kirkos",
    cur: "National",
    emoji: "👩🏾‍🏫",
    avail: "Wed",
    dist: "4.8 km",
    badges: ["fayda", "degree", "gold"],
  },
  {
    id: "5",
    name: "Abel Girma",
    sub: "Physics & Maths",
    rate: 480,
    rating: 4.9,
    sessions: 189,
    city: "Bole",
    cur: "Cambridge",
    emoji: "👨🏾‍💻",
    avail: "Today",
    dist: "0.9 km",
    badges: ["fayda", "degree", "gold", "elite"],
  },
  {
    id: "6",
    name: "Hana Mulugeta",
    sub: "Biology & Chemistry",
    rate: 400,
    rating: 4.6,
    sessions: 342,
    city: "Arada",
    cur: "National",
    emoji: "👩🏿‍🔬",
    avail: "Thu",
    dist: "5.6 km",
    badges: ["fayda", "degree"],
  },
  {
    id: "7",
    name: "Yonas Tadesse",
    sub: "Amharic & History",
    rate: 360,
    rating: 4.8,
    sessions: 521,
    city: "Lideta",
    cur: "National",
    emoji: "👨🏾‍🏫",
    avail: "Today",
    dist: "2.7 km",
    badges: ["fayda", "degree", "gold"],
  },
  {
    id: "8",
    name: "Meron Hailu",
    sub: "English & French",
    rate: 550,
    rating: 5.0,
    sessions: 134,
    city: "Hawassa",
    cur: "Cambridge",
    emoji: "👩🏾‍💼",
    avail: "Flexible",
    dist: "12.3 km",
    badges: ["fayda", "degree", "elite"],
  },
];

const CITIES = ["All", "Bole", "Yeka", "Sarbet", "Hawassa", "Kirkos", "Arada", "Lideta"];
const CURRICULA = ["All", "National", "Cambridge", "Both"];

function BadgePill({ type }: { type: string }) {
  if (type === "fayda")
    return (
      <span className="rounded-full bg-[#00A389] px-2 py-0.5 text-[10px] font-bold text-white">
        🪪 Fayda
      </span>
    );
  if (type === "degree")
    return (
      <span className="rounded-full bg-[#0284C7] px-2 py-0.5 text-[10px] font-bold text-white">
        🎓 Degree
      </span>
    );
  if (type === "gold")
    return (
      <span className="rounded-full bg-[#F59E0B] px-2 py-0.5 text-[10px] font-bold text-[#7C2D12]">
        ⭐ Gold
      </span>
    );
  if (type === "elite")
    return (
      <span className="rounded-full bg-[#7C3AED] px-2 py-0.5 text-[10px] font-bold text-white">
        💎 Elite
      </span>
    );
  return null;
}

export default function FindTutorsPage() {
  const [q, setQ] = useState("");
  const [priceRange, setPriceRange] = useState(600);
  const [curriculum, setCurriculum] = useState("All");
  const [city, setCity] = useState("All");
  const [sort, setSort] = useState("rating");

  const tutors = useMemo(() => {
    let list = ALL_TUTORS.filter(
      (t) =>
        t.rate <= priceRange &&
        (curriculum === "All" || t.cur === curriculum || t.cur === "Both") &&
        (city === "All" || t.city === city) &&
        (q.trim() === "" ||
          t.name.toLowerCase().includes(q.toLowerCase()) ||
          t.sub.toLowerCase().includes(q.toLowerCase()))
    );

    if (sort === "price") list = [...list].sort((a, b) => a.rate - b.rate);
    else if (sort === "sessions") list = [...list].sort((a, b) => b.sessions - a.sessions);
    else list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [q, priceRange, curriculum, city, sort]);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Search bar */}
      <div className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:gap-3 md:px-6">
          <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3">
            <span className="text-[var(--secondary)]">🔍</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by subject, tutor name..."
              className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--secondary)]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {CITIES.slice(0, 6).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={`shrink-0 rounded-[10px] border px-3.5 py-2 text-[13px] font-semibold transition ${
                  city === c
                    ? "border-[var(--primary)] bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40"
                    : "border-[var(--border)] text-[var(--secondary)]"
                }`}
              >
                {c === "All" ? "All Cities" : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[240px_1fr] md:px-6 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="mb-3 text-sm font-bold text-[var(--foreground)]">Curriculum</p>
            {CURRICULA.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurriculum(c)}
                className="flex w-full items-center gap-2 py-2 text-left"
              >
                <span
                  className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 ${
                    curriculum === c
                      ? "border-[var(--primary)] bg-[var(--primary)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  {curriculum === c && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
                <span className="text-[13px] text-[var(--foreground)]">
                  {c === "Both"
                    ? "Both (National + Cambridge)"
                    : c === "All"
                      ? "All Curricula"
                      : c}
                </span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--foreground)]">Max Price</span>
              <span className="text-[13px] font-extrabold text-[var(--primary)]">
                {priceRange} ETB/hr
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={800}
              step={10}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-[var(--secondary)]">
              <span>300 ETB</span>
              <span>800 ETB</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="mb-3 text-sm font-bold text-[var(--foreground)]">Trust Badges</p>
            {[
              { l: "🪪 Fayda ID", c: "#00A389" },
              { l: "🎓 Degree", c: "#0284C7" },
              { l: "⭐ Gold Tutor", c: "#F59E0B" },
              { l: "💎 Elite", c: "#7C3AED" },
            ].map((b) => (
              <div key={b.l} className="flex items-center gap-2 py-1.5">
                <span
                  className="h-3.5 w-3.5 rounded border-2"
                  style={{ borderColor: b.c }}
                />
                <span className="text-xs text-[var(--secondary)]">{b.l}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[15px] font-bold text-[var(--foreground)]">
              {tutors.length} tutors found
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[13px] text-[var(--foreground)] outline-none"
            >
              <option value="rating">Sort: Highest Rated</option>
              <option value="price">Sort: Lowest Price</option>
              <option value="sessions">Sort: Most Sessions</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tutors.map((t) => (
              <Link
                key={t.id}
                href={`/tutors/${t.id}`}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--primary)]/40 hover:shadow-md"
              >
                <div className="mb-3.5 flex items-start justify-between">
                  <div className="flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-teal-300 text-2xl">
                    {t.emoji}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-[#00A389] dark:bg-emerald-950/40">
                      ● {t.avail}
                    </span>
                    <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-semibold text-[var(--secondary)]">
                      📍 {t.dist}
                    </span>
                  </div>
                </div>

                <p className="text-[15px] font-extrabold text-[var(--foreground)]">{t.name}</p>
                <p className="mb-2.5 text-[13px] text-[var(--secondary)]">
                  {t.sub} · {t.city}
                </p>

                <div className="mb-3.5 flex flex-wrap gap-1.5">
                  {t.badges.map((b) => (
                    <BadgePill key={b} type={b} />
                  ))}
                  <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-semibold text-[var(--secondary)]">
                    {t.cur}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--border)] pt-3.5">
                  <div>
                    <span className="font-mono text-lg font-black text-[var(--primary)]">
                      {t.rate}
                    </span>
                    <span className="text-xs text-[var(--secondary)]"> ETB/hr</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-amber-500">★ {t.rating}</p>
                    <p className="text-[11px] text-[var(--secondary)]">{t.sessions} sessions</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {tutors.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center">
              <p className="text-[var(--secondary)]">No tutors match your filters.</p>
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setCity("All");
                  setCurriculum("All");
                  setPriceRange(800);
                }}
                className="mt-3 text-sm font-bold text-[var(--primary)]"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}