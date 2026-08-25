"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function AddChildPage() {
  const router = useRouter();
  const [studentName, setStudentName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [curriculum, setCurriculum] = useState("NATIONAL_MINISTRY");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parents/children`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentName, gradeLevel, curriculum }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to add child");
      }

      router.push("/parent/children");
    } catch (error: any) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Add Child</h1>
        <p className="text-[var(--secondary)] mb-8">
          Create a student profile for tutoring and progress tracking.
        </p>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Student Name</label>
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Grade Level</label>
            <input
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              placeholder="Grade 8"
              required
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Curriculum</label>
            <select
              value={curriculum}
              onChange={(e) => setCurriculum(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            >
              <option value="NATIONAL_MINISTRY">National Ministry</option>
              <option value="CAMBRIDGE_IGCSE">Cambridge IGCSE</option>
              <option value="AMERICAN_CURRICULUM">American Curriculum</option>
              <option value="INTERNATIONAL_BACCALAUREATE">IB</option>
            </select>
          </div>

          {message && <p className="text-sm text-[var(--secondary)]">{message}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Saving..." : "Save Child"}
          </button>
        </form>
      </section>
    </main>
  );
}