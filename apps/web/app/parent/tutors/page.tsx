"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Tutor = {
  id: string;
  fullName: string;
  bio?: string;
  subjects: string[];
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  monthlyRate: number;
  distanceText: string;
  distanceMeters: number;
  badgeTier: string;
  isIdVerified: boolean;
  isEduVerified: boolean;
  latitude: number;
  longitude: number;
};

export default function FindTutorsWebPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [maxDistanceKm, setMaxDistanceKm] = useState(15);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  // Center on Addis Ababa (9.0108, 38.7615)
  const centerLat = 9.0108;
  const centerLng = 38.7615;

  const loadTutors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        lat: String(centerLat),
        lng: String(centerLng),
        maxDistanceKm: String(maxDistanceKm),
      });

      if (subject.trim()) params.set("subjects", subject.trim());

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/matching/tutors?${params.toString()}`
      );
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setTutors(list);
      if (list.length > 0) setSelectedTutor(list[0]);
    } catch {
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutors();
  }, [maxDistanceKm]);

  // Coordinate Projection Helper for interactive Canvas Map
  const mapWidth = 600;
  const mapHeight = 500;
  const delta = 0.12; // degree viewport

  const project = (lat: number, lng: number) => {
    const x = ((lng - (centerLng - delta / 2)) / delta) * mapWidth;
    const y = (((centerLat + delta / 2) - lat) / delta) * mapHeight;
    return { x: Math.max(20, Math.min(mapWidth - 20, x)), y: Math.max(20, Math.min(mapHeight - 20, y)) };
  };

  const centerPos = project(centerLat, centerLng);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Find Verified Tutors</h1>
          <p className="text-[var(--secondary)] mt-1">
            Real-time PostGIS spatial radius matching across Addis Ababa
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="card p-3 flex items-center gap-3">
            <span className="text-xs font-bold text-[var(--secondary)] whitespace-nowrap">
              Radius: {maxDistanceKm} km
            </span>
            <input
              type="range"
              min="2"
              max="30"
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="accent-[var(--primary)] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Filter by subject (e.g. Mathematics, Chemistry, English)..."
          className="flex-1 rounded-xl border border-[var(--border)] px-4 py-2.5 bg-[var(--surface)] outline-none"
          onKeyDown={(e) => e.key === "Enter" && loadTutors()}
        />
        <button onClick={loadTutors} className="btn btn-primary px-6">
          Search Tutors
        </button>
      </div>

      {/* 2-Column Split: Interactive Map + Tutor Feed */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Interactive Map Visualizer */}
        <div className="lg:col-span-7 card p-5 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
              <span>📍</span> Addis Ababa Spatial Radar ({tutors.length} verified tutors)
            </h3>
            <span className="text-xs text-[var(--secondary)]">Click any pin to inspect</span>
          </div>

          <div className="relative w-full h-[500px] bg-slate-900 rounded-2xl overflow-hidden border border-[var(--border)] shadow-inner flex items-center justify-center">
            {/* SVG Grid and Radar Circles */}
            <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
              {/* Radar Rings */}
              <circle cx={centerPos.x} cy={centerPos.y} r={80} fill="none" stroke="rgba(15, 118, 110, 0.2)" strokeWidth="1" />
              <circle cx={centerPos.x} cy={centerPos.y} r={160} fill="none" stroke="rgba(15, 118, 110, 0.2)" strokeWidth="1" />
              <circle
                cx={centerPos.x}
                cy={centerPos.y}
                r={(maxDistanceKm / 30) * 240}
                fill="rgba(15, 118, 110, 0.08)"
                stroke="#0F766E"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Central Home Pin */}
              <circle cx={centerPos.x} cy={centerPos.y} r="8" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
              <text x={centerPos.x + 12} y={centerPos.y + 4} fill="#93C5FD" fontSize="11" fontWeight="bold">
                Your Home
              </text>
            </svg>

            {/* Interactive Tutor Pins */}
            {tutors.map((tutor) => {
              const pos = project(tutor.latitude || centerLat, tutor.longitude || centerLng);
              const isSelected = selectedTutor?.id === tutor.id;

              return (
                <button
                  key={tutor.id}
                  style={{ left: pos.x, top: pos.y }}
                  onClick={() => setSelectedTutor(tutor)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 text-xs font-bold transition transform hover:scale-110 shadow-lg ${
                    isSelected
                      ? "bg-amber-500 text-white ring-4 ring-amber-300/40 z-30"
                      : "bg-[var(--primary)] text-white ring-2 ring-white z-20"
                  }`}
                >
                  ETB {tutor.hourlyRate}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Tutor Detail & Results List */}
        <div className="lg:col-span-5 space-y-4">
          {selectedTutor ? (
            <div className="card border-2 border-[var(--primary)]/30 p-6 shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">{selectedTutor.fullName}</h2>
                  <p className="text-sm text-[var(--secondary)] mt-0.5">
                    {(selectedTutor.subjects || []).join(" • ")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-[var(--primary)]">
                    ETB {selectedTutor.hourlyRate}/hr
                  </div>
                  <div className="text-xs text-[var(--secondary)]">
                    Monthly: ETB {selectedTutor.monthlyRate}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 my-4">
                {selectedTutor.isIdVerified && <span className="badge">🛡️ National ID Verified</span>}
                {selectedTutor.isEduVerified && <span className="badge">🎓 Degree Verified</span>}
                {selectedTutor.badgeTier === "GOLD_ELITE" && <span className="badge">🥇 Gold Elite</span>}
              </div>

              <p className="text-sm text-[var(--secondary)] line-clamp-3 mb-6">
                {selectedTutor.bio || "Experienced tutor certified to teach Ethiopian National & Cambridge curriculums."}
              </p>

              <div className="flex gap-3">
                <Link href={`/parent/tutors/${selectedTutor.id}`} className="btn btn-primary flex-1 text-center py-2.5">
                  View Full Profile & Hire
                </Link>
                <Link href={`/parent/chat/${selectedTutor.id}`} className="btn btn-secondary py-2.5">
                  💬 Chat
                </Link>
              </div>
            </div>
          ) : null}

          {/* Scrollable Tutor Cards */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {loading ? (
              <p className="text-sm text-[var(--secondary)] p-4">Loading nearby teachers...</p>
            ) : tutors.length === 0 ? (
              <div className="card p-6 text-center text-[var(--secondary)]">
                No tutors found in this radius. Try increasing the distance slider.
              </div>
            ) : (
              tutors.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTutor(t)}
                  className={`card p-4 cursor-pointer hover:border-[var(--primary)] transition ${
                    selectedTutor?.id === t.id ? "border-[var(--primary)] bg-[var(--surface-2)]" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm">{t.fullName}</h4>
                      <p className="text-xs text-[var(--secondary)]">
                        ★ {t.rating.toFixed(1)} ({t.totalReviews}) • {t.distanceText}
                      </p>
                    </div>
                    <span className="font-bold text-sm text-[var(--primary)]">ETB {t.hourlyRate}/hr</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}