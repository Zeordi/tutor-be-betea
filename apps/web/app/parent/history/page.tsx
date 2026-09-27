"use client";

import { useEffect, useState } from "react";
import { apiFetch, paths } from "@/lib/api";
import Link from "next/link";

type Contract = {
  id: string;
  status: string;
  agreedAmount: number;
  escrowHeldAmount: number;
  startDate: string;
  endDate: string;
  teacher: { fullName: string; avatarUrl: string | null };
  student: { studentName: string; gradeLevel: string };
};

export default function SessionHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<Contract[]>(paths.contractsParent)
      .then((data) => {
        if (!cancelled) setContracts(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load history");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const completed = contracts.filter((c) => c.status === "COMPLETED");
  const disputed = contracts.filter((c) => c.status === "DISPUTED");
  const totalSpent = completed.reduce((sum, c) => sum + Number(c.agreedAmount || 0), 0);

  const rows = completed.map((c) => ({
    date: new Date(c.endDate || c.startDate).toLocaleDateString(),
    tutor: c.teacher.fullName,
    child: c.student.studentName,
    subject: "Tutoring",
    duration: `${Math.max(1, Math.floor((new Date(c.endDate).getTime() - new Date(c.startDate).getTime()) / (1000 * 60 * 60 * 24)))} days`,
    amount: Number(c.agreedAmount),
    status: c.status.toLowerCase(),
    contractId: c.id,
  }));

  if (loading) {
    return (
      <div>
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Session History</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Invoices & past sessions</p>
        </div>
        <button
          type="button"
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 dark:border-slate-700 dark:text-slate-300"
        >
          📥 Export invoices
        </button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          [String(contracts.length), "Total sessions"],
          [`${totalSpent.toLocaleString()} ETB`, "Total spent"],
          [String(disputed.length), "Active dispute"],
        ].map(([v, l]) => (
          <div
            key={l}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-[#112240]"
          >
            <p className="text-2xl font-black text-teal-600">{v}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{l}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#112240]">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
              {["Date", "Tutor", "Child", "Subject", "Duration", "Amount", "Status", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">
                  No completed sessions yet.
                </td>
              </tr>
            )}
            {rows.map((s, i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3.5 text-[13px] text-slate-500 dark:text-slate-400">{s.date}</td>
                <td className="px-4 py-3.5 text-[13px] font-bold text-slate-800 dark:text-white">
                  {s.tutor}
                </td>
                <td className="px-4 py-3.5 text-[13px] text-slate-600 dark:text-slate-300">{s.child}</td>
                <td className="px-4 py-3.5 text-[13px] text-slate-500 dark:text-slate-400">{s.subject}</td>
                <td className="px-4 py-3.5 text-[13px] text-slate-500 dark:text-slate-400">{s.duration}</td>
                <td className="px-4 py-3.5 font-mono text-sm font-extrabold text-teal-600">
                  {s.amount.toLocaleString()} ETB
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${
                      s.status === "completed"
                        ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                        : s.status === "disputed"
                          ? "bg-red-50 text-red-600 dark:bg-red-950/40"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <Link
                    href={`/parent/contracts/${s.contractId}`}
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
                  >
                    Invoice
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
