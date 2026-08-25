"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function CreateJobPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isUrgentBoost, setIsUrgentBoost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId,
          subjects: subjects.split(",").map((s) => s.trim()).filter(Boolean),
          monthlyBudget: Number(monthlyBudget),
          isUrgentBoost,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create job");
      }

      setMessage("Job posted successfully.");
      router.push("/parent/jobs");
    } catch (error: any) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
        <p className="text-[var(--secondary)] mb-8">
          Describe what your child needs and receive applications from verified tutors.
        </p>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Child / Student ID</label>
            <input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Student profile ID"
              required
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Subjects</label>
            <input
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="Mathematics, English, Physics"
              required
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Monthly Budget (ETB)</label>
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              placeholder="3000"
              required
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={isUrgentBoost}
              onChange={(e) => setIsUrgentBoost(e.target.checked)}
            />
            Mark as urgent (get faster applications)
          </label>

          {message && <p className="text-sm text-[var(--secondary)]">{message}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </section>
    </main>
  );
}