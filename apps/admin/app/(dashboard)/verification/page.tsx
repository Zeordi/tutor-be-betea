"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type VerificationItem = {
  id: string;
  teacherId: string;
  documentType: string;
  status: string;
  createdAt: string;
};

export default function VerificationQueuePage() {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  const loadQueue = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/verification/queue`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const filtered = items.filter((item) => {
    if (filter === "ALL") return true;
    return item.documentType === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Verification Queue</h1>
          <p className="text-sm text-[var(--secondary)] mt-1">
            Review AES-256 encrypted Fayda IDs, university degrees, and biometric selfies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none"
          >
            <option value="ALL">All Documents ({items.length})</option>
            <option value="NATIONAL_ID">National IDs / Fayda</option>
            <option value="DEGREE">Degrees & Transcripts</option>
            <option value="LIVENESS_SELFIE">Liveness Selfies</option>
          </select>
          <button onClick={loadQueue} className="btn btn-primary text-sm py-2 px-4">
            Refresh
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-[var(--secondary)]">Loading pending vault documents...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-[var(--secondary)]">
            🎉 All caught up! No pending verification requests in the queue.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-2)] text-[var(--secondary)] font-semibold uppercase text-xs">
              <tr>
                <th className="p-4">Document Type</th>
                <th className="p-4">Teacher ID</th>
                <th className="p-4">Status</th>
                <th className="p-4">Submitted At</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y border-[var(--border)]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--surface-2)]/50 transition">
                  <td className="p-4 font-semibold">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold">
                      {item.documentType === "NATIONAL_ID" ? "🪪 Fayda / ID" : item.documentType === "DEGREE" ? "🎓 Degree" : "🤳 Liveness Selfie"}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-[var(--secondary)]">{item.teacherId}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--secondary)]">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/verification/${item.id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white font-semibold text-xs hover:opacity-90 transition"
                    >
                      Review & Decrypt →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}