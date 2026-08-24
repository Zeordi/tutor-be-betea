"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TutorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `\( {process.env.NEXT_PUBLIC_API_URL}/teachers/ \){id}/public`
        );
        const data = await res.json();
        setTutor(data);
      } catch {
        setTutor(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--secondary)]">Loading profile...</p>
      </main>
    );
  }

  if (!tutor) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <h2 className="text-xl font-bold mb-2">Tutor not found</h2>
          <button className="btn btn-primary" onClick={() => router.push("/parent/tutors")}>
            Back to Find Tutors
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10 max-w-4xl">
        <button
          onClick={() => router.back()}
          className="text-sm text-[var(--secondary)] mb-6"
        >
          ← Back
        </button>

        <div className="card">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{tutor.fullName || "Tutor"}</h1>
              <p className="text-[var(--secondary)]">
                {(tutor.subjects || []).join(" • ")}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[var(--primary)]">
                ETB {tutor.hourlyRate || 0}/hr
              </div>
              <div className="text-sm text-[var(--secondary)]">
                Monthly: ETB {tutor.monthlyRate || 0}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            {tutor.isIdVerified && <span className="badge">🛡️ ID Verified</span>}
            {tutor.isEduVerified && <span className="badge">🎓 Degree Verified</span>}
            {tutor.badgeTier && <span className="badge">🏆 {tutor.badgeTier}</span>}
          </div>

          <div className="mt-6">
            <h3 className="font-bold mb-2">About</h3>
            <p className="text-[var(--secondary)] leading-relaxed">
              {tutor.bio || "This tutor has not added a bio yet."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="rounded-2xl bg-[var(--surface-2)] p-4">
              <div className="text-sm text-[var(--secondary)]">Rating</div>
              <div className="text-xl font-bold">
                ★ {Number(tutor.rating || 0).toFixed(1)}
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--surface-2)] p-4">
              <div className="text-sm text-[var(--secondary)]">Reviews</div>
              <div className="text-xl font-bold">{tutor.totalReviews || 0}</div>
            </div>
            <div className="rounded-2xl bg-[var(--surface-2)] p-4">
              <div className="text-sm text-[var(--secondary)]">Hours Taught</div>
              <div className="text-xl font-bold">{tutor.totalHoursTaught || 0}</div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn btn-primary">Hire Tutor</button>
            <button className="btn btn-secondary">Send Message</button>
          </div>
        </div>
      </section>
    </main>
  );
}