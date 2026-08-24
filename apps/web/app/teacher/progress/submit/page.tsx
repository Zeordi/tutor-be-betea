"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubmitProgressPage() {
  const router = useRouter();
  const [contractId, setContractId] = useState("");
  const [weekNumber, setWeekNumber] = useState("");
  const [topicsCovered, setTopicsCovered] = useState("");
  const [quizScore, setQuizScore] = useState("");
  const [strengthsNotes, setStrengthsNotes] = useState("");
  const [improvementAreas, setImprovementAreas] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contractId,
          weekNumber: Number(weekNumber),
          topicsCovered,
          quizScore: quizScore ? Number(quizScore) : null,
          strengthsNotes,
          improvementAreas,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to submit report");
      }

      setMessage("Progress report submitted successfully.");
      router.push("/teacher");
    } catch (error: any) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Submit Progress Report</h1>
        <p className="text-[var(--secondary)] mb-8">
          Share weekly learning updates with parents.
        </p>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Contract ID</label>
            <input
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Week Number</label>
            <input
              type="number"
              value={weekNumber}
              onChange={(e) => setWeekNumber(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Topics Covered</label>
            <textarea
              value={topicsCovered}
              onChange={(e) => setTopicsCovered(e.target.value)}
              rows={3}
              required
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Quiz Score (optional)</label>
            <input
              type="number"
              value={quizScore}
              onChange={(e) => setQuizScore(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Strengths</label>
            <textarea
              value={strengthsNotes}
              onChange={(e) => setStrengthsNotes(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Areas to Improve</label>
            <textarea
              value={improvementAreas}
              onChange={(e) => setImprovementAreas(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          {message && <p className="text-sm text-[var(--secondary)]">{message}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </section>
    </main>
  );
}