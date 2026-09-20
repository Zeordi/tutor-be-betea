"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

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

export default function ParentContractsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [releasing, setReleasing] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<Contract[]>(paths.contractsParent)
      .then((data) => {
        if (!cancelled) setContracts(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load contracts");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleRelease = async (contractId: string) => {
    setReleasing(contractId);
    try {
      await apiFetch(paths.escrowRelease(contractId), { method: "POST" });
      setContracts((prev) =>
        prev.map((c) =>
          c.id === contractId ? { ...c, status: "COMPLETED", escrowHeldAmount: 0 } : c,
        ),
      );
    } catch (err: any) {
      alert(err.message || "Failed to release escrow");
    } finally {
      setReleasing(null);
    }
  };

  const totalHeld = contracts.reduce((sum, c) => sum + Number(c.escrowHeldAmount || 0), 0);

  if (loading) {
    return (
      <div className="space-y-5 p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
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
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Contracts & Escrow</h2>
        <div className="text-right">
          <p className="text-xs text-slate-500">Total escrow held</p>
          <p className="text-lg font-black text-amber-600">{totalHeld.toLocaleString()} ETB</p>
        </div>
      </div>

      {contracts.length === 0 && (
        <p className="text-sm text-slate-400">No contracts yet. Find a tutor to get started.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {contracts.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-[#112240]"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
                {c.teacher.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">{c.teacher.fullName}</p>
                <p className="text-xs text-slate-400">
                  {c.student.studentName} · {c.student.gradeLevel}
                </p>
              </div>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Agreed amount</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {Number(c.agreedAmount).toLocaleString()} ETB
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Escrow held</span>
                <span className="font-bold text-amber-600">
                  {Number(c.escrowHeldAmount).toLocaleString()} ETB
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                    c.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30"
                      : c.status === "PENDING_ESCROW"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30"
                        : c.status === "DISPUTED"
                          ? "bg-red-50 text-red-600 dark:bg-red-900/30"
                          : c.status === "COMPLETED"
                            ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {c.status.toLowerCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Period</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {new Date(c.startDate).toLocaleDateString()} — {new Date(c.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/parent/sessions/${c.id}`}
                className="flex-1 rounded-xl border border-slate-200 py-2 text-center text-xs font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                View Sessions
              </Link>
              {c.status === "ACTIVE" && (
                <button
                  type="button"
                  onClick={() => handleRelease(c.id)}
                  disabled={releasing === c.id}
                  className="flex-1 rounded-xl bg-teal-600 py-2 text-xs font-bold text-white disabled:opacity-70"
                >
                  {releasing === c.id ? "Releasing…" : "Request Release"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
