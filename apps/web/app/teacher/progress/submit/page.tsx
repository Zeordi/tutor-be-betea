"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, paths } from "@/lib/api";

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
      const id = contractId.trim();
      if (!id) {
        throw new Error("Contract ID is required");
      }

      // POST /progress/:contractId  (not POST /progress)
      await apiFetch(paths.progressSubmit(id), {
        method: "POST",
        body: JSON.stringify({
          weekNumber: Number(weekNumber),
          topicsCovered,
          quizScore: quizScore ? Number(quizScore) : null,
          strengthsNotes,
          improvementAreas,
        }),
      });

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
            <label className="block text-sm font-semibold mb-2">
              Contract ID
            </label>
            <input
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Week number
            </label>
            <input
              type="number"
              min={1}
              value={weekNumber}
              onChange={(e) => setWeekNumber(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Topics covered
            </label>
            <textarea
              value={topicsCovered}
              onChange={(e) => setTopicsCovered(e.target.value)}
              required
              rows={3}
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Quiz score (optional)
            </label>
            <input
              type="number"
              min={0}
              max={100}
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
            <label className="block text-sm font-semibold mb-2">
              Areas to improve
            </label>
            <textarea
              value={improvementAreas}
              onChange={(e) => setImprovementAreas(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          {message && (
            <p className="text-sm text-[var(--secondary)]">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Submitting…" : "Submit report"}
          </button>
        </form>
      </section>
    </main>
  );
}