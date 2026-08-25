"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Jobs</h1>
            <p className="text-[var(--secondary)]">Jobs you have posted for tutors.</p>
          </div>
          <Link href="/parent/jobs/create" className="btn btn-primary">
            Post Job
          </Link>
        </div>

        {loading ? (
          <p className="text-[var(--secondary)]">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-xl font-bold mb-2">No jobs yet</h3>
            <p className="text-[var(--secondary)] mb-4">
              Post your first job to start receiving tutor applications.
            </p>
            <Link href="/parent/jobs/create" className="btn btn-primary">
              Post a Job
            </Link>
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
                      Status: {job.status}
                    </p>
                  </div>
                  <div className="font-bold text-[var(--primary)]">
                    ETB {job.monthlyBudget}
                  </div>
                </div>
                {job.isUrgentBoost && (
                  <span className="badge mt-4">Urgent</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}