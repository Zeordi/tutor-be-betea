"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, getToken } from "@/lib/api";

export default function ApplyJobPage() {
  const { id } = useParams();
  const router = useRouter();
  const [coverMessage, setCoverMessage] = useState("");
  const [proposedRate, setProposedRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`\( {process.env.NEXT_PUBLIC_API_URL}/jobs/ \){id}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coverMessage,
          proposedRate: Number(proposedRate),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to apply");
      }

      setMessage("Application submitted successfully.");
      router.push("/teacher/jobs");
    } catch (error: any) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Apply to Job</h1>
        <p className="text-[var(--secondary)] mb-8">
          Send your proposal to the parent.
        </p>

        <form onSubmit={handleApply} className="card space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Cover Message</label>
            <textarea
              value={coverMessage}
              onChange={(e) => setCoverMessage(e.target.value)}
              rows={5}
              required
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
              placeholder="Explain why you are a great fit..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Proposed Monthly Rate (ETB)</label>
            <input
              type="number"
              value={proposedRate}
              onChange={(e) => setProposedRate(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
          </div>

          {message && <p className="text-sm text-[var(--secondary)]">{message}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </section>
    </main>
  );
}