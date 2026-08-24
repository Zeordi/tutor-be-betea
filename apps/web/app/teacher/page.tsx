"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--secondary)]">Checking authentication...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--border)] bg-[var(--background)]">
        <div className="container flex items-center justify-between py-4">
          <div className="text-xl font-bold text-[var(--primary)]">
            Tutor Be Betea
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="btn btn-secondary text-sm px-4 py-2"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="container py-10">
        <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-[var(--secondary)] mb-8">
          Manage jobs, contracts, verification, and your tutoring sessions.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="card">
            <h3 className="text-lg font-bold mb-2">Available Jobs</h3>
            <p className="text-[var(--secondary)] text-sm">
              Browse open tutoring jobs posted by parents.
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-2">My Contracts</h3>
            <p className="text-[var(--secondary)] text-sm">
              Track active contracts and session schedules.
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-2">Verification</h3>
            <p className="text-[var(--secondary)] text-sm">
              Upload ID and education documents to earn Trust Badges.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}