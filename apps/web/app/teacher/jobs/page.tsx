"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch, getToken } from "@/lib/api";


export default function TeacherJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`);
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10">
        <h1 className="text-3xl font-bold mb-2">Available Jobs</h1>
        <p className="text-[var(--secondary)] mb-8">
          Apply to open tutoring requests from parents.
        </p>

        {loading ? (
          <p className="text-[var(--secondary)]">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-xl font-bold mb-2">No open jobs</h3>
            <p className="text-[var(--secondary)]">
              Check back later for new tutoring opportunities.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <div key={job.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-lg">
                      {(job.subjects || []).join(", ")}
                    </h3>
                    <p className="text-sm text-[var(--secondary)] mt-1">
                      Budget: ETB {job.monthlyBudget}
                    </p>
                  </div>
                  {job.isUrgentBoost && <span className="badge">Urgent</span>}
                </div>

                <div className="mt-5">
                  <Link
                    href={`/teacher/jobs/${job.id}/apply`}
                    className="btn btn-primary"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}