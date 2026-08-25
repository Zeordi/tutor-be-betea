"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Tutor = {
  id: string;
  fullName: string;
  subjects?: string[];
  rating?: number;
  totalReviews?: number;
  hourlyRate?: number;
  distanceText?: string;
  isIdVerified?: boolean;
  isEduVerified?: boolean;
  badgeTier?: string;
};

export default function FindTutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTutors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        lat: "9.03",
        lng: "38.74",
        maxDistanceKm: "15",
      });
      if (subject.trim()) params.set("subjects", subject.trim());

      const res = await fetch(
        `\( {process.env.NEXT_PUBLIC_API_URL}/matching/tutors? \){params.toString()}`
      );
      const data = await res.json();
      setTutors(Array.isArray(data) ? data : []);
    } catch {
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutors();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10">
        <h1 className="text-3xl font-bold mb-2">Find Tutors</h1>
        <p className="text-[var(--secondary)] mb-6">
          Verified teachers with Trust Badges and escrow protection.
        </p>

        <div className="card mb-6 flex flex-col md:flex-row gap-3">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject (e.g. Mathematics)"
            className="flex-1 rounded-xl border border-[var(--border)] px-4 py-3 outline-none bg-[var(--surface)]"
          />
          <button onClick={loadTutors} className="btn btn-primary">
            Search
          </button>
        </div>

        {loading ? (
          <p className="text-[var(--secondary)]">Loading tutors...</p>
        ) : tutors.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-xl font-bold mb-2">No tutors found</h3>
            <p className="text-[var(--secondary)]">
              Try another subject or increase search distance.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {tutors.map((tutor) => (
              <Link
                key={tutor.id}
                href={`/parent/tutors/${tutor.id}`}
                className="card hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-lg">{tutor.fullName}</h3>
                    <p className="text-sm text-[var(--secondary)] mt-1">
                      {(tutor.subjects || []).slice(0, 3).join(" • ")}
                    </p>
                  </div>
                  <div className="font-bold text-[var(--primary)]">
                    ETB {tutor.hourlyRate || 0}/hr
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {tutor.isIdVerified && <span className="badge">ID Verified</span>}
                  {tutor.isEduVerified && <span className="badge">Degree</span>}
                  {tutor.badgeTier === "GOLD_ELITE" && (
                    <span className="badge">Gold Elite</span>
                  )}
                </div>

                <p className="text-sm text-[var(--secondary)] mt-4">
                  ★ {Number(tutor.rating || 0).toFixed(1)} ({tutor.totalReviews || 0})
                  {tutor.distanceText ? ` • ${tutor.distanceText}` : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}