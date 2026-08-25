"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ParentProgressPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/progress/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReports(Array.isArray(data) ? data : []);
      } catch {
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10">
        <h1 className="text-3xl font-bold mb-2">Progress Reports</h1>
        <p className="text-[var(--secondary)] mb-8">
          Weekly mastery updates from your tutors.
        </p>

        {loading ? (
          <p className="text-[var(--secondary)]">Loading reports...</p>
        ) : reports.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-xl font-bold mb-2">No reports yet</h3>
            <p className="text-[var(--secondary)]">
              Progress reports will appear here after tutors submit weekly updates.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">Week {report.weekNumber}</h3>
                  {report.quizScore != null && (
                    <span className="badge">Score: {report.quizScore}</span>
                  )}
                </div>
                <p className="text-sm text-[var(--secondary)] mb-2">
                  <strong>Topics:</strong> {report.topicsCovered}
                </p>
                {report.strengthsNotes && (
                  <p className="text-sm text-[var(--secondary)] mb-1">
                    <strong>Strengths:</strong> {report.strengthsNotes}
                  </p>
                )}
                {report.improvementAreas && (
                  <p className="text-sm text-[var(--secondary)]">
                    <strong>Improve:</strong> {report.improvementAreas}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}