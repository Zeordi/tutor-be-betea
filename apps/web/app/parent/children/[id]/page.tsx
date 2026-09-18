"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

type ChildDetail = {
  id: string;
  studentName: string;
  gradeLevel: string;
  curriculum: string;
  subjects: string[];
  specialLearningNotes: string | null;
  createdAt: string;
  contracts: {
    id: string;
    status: string;
    teacherId: string;
    teacher: { fullName: string; avatarUrl: string | null };
  }[];
  jobs: {
    id: string;
    status: string;
    subjects: string[];
  }[];
};

export default function ChildProfileWebPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [child, setChild] = useState<ChildDetail | null>(null);
  const [curriculum, setCurriculum] = useState<"national" | "cambridge">("national");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<ChildDetail>(paths.child(id))
      .then((data) => {
        if (!cancelled) {
          setChild(data);
          const cur = data.curriculum || "";
          setCurriculum(cur === "NATIONAL_MINISTRY" ? "national" : "cambridge");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load child");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  if (error || !child) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Link href="/parent/children" className="text-sm font-semibold text-[var(--secondary)]">
          ← Children
        </Link>
        <p className="text-sm text-red-600">{error || "Child not found"}</p>
      </div>
    );
  }

  const curLabel = child.curriculum?.replace(/_/g, " ").split(" ").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ") || "National Ministry";

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/parent/children" className="text-sm font-semibold text-[var(--secondary)]">
            ← Children
          </Link>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Child Profile</h1>
        </div>
        <button type="button" className="text-sm font-bold text-[var(--primary)]">
          Save
        </button>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)] text-xl font-extrabold text-white">
          {child.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <p className="mt-3 text-lg font-extrabold text-[var(--foreground)]">{child.studentName}</p>
        <p className="text-sm text-[var(--secondary)]">
          {child.gradeLevel} · {curLabel}
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">CURRICULUM</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setCurriculum("national")}
            className={`rounded-2xl border-2 p-4 text-left transition ${
              curriculum === "national"
                ? "border-[var(--primary)] bg-[var(--primary)]/5"
                : "border-[var(--border)]"
            }`}
          >
            <p className={`text-sm font-bold ${curriculum === "national" ? "text-[var(--primary)]" : "text-[var(--foreground)]"}`}>
              🇪🇹 Ethiopian National
            </p>
            <p className="mt-1 text-xs text-[var(--secondary)]">Grades 1–12 National Standard</p>
          </button>
          <button
            type="button"
            onClick={() => setCurriculum("cambridge")}
            className={`rounded-2xl border-2 p-4 text-left transition ${
              curriculum === "cambridge"
                ? "border-[var(--primary)] bg-[var(--primary)]/5"
                : "border-[var(--border)]"
            }`}
          >
            <p className={`text-sm font-bold ${curriculum === "cambridge" ? "text-[var(--primary)]" : "text-[var(--foreground)]"}`}>
              🎓 Cambridge / IGCSE
            </p>
            <p className="mt-1 text-xs text-[var(--secondary)]">International curriculum</p>
          </button>
        </div>
      </div>

      {child.subjects && child.subjects.length > 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wide text-[var(--secondary)]">SUBJECTS</p>
            <Link href="/parent/tutors" className="text-xs font-bold text-[var(--primary)]">+ Add Tutor</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {child.subjects.map((s) => (
              <span
                key={s}
                className="rounded-full border border-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {child.contracts && child.contracts.length > 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wide text-[var(--secondary)]">ASSIGNED TUTORS</p>
            <Link href="/parent/tutors" className="text-xs font-bold text-[var(--primary)]">+ Add Tutor</Link>
          </div>
          <div className="space-y-2">
            {child.contracts
              .filter((c) => c.teacher)
              .map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-xl bg-[var(--muted)] p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] font-bold text-white">
                    {c.teacher.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "?"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[var(--foreground)]">
                      {c.teacher.fullName || "Unknown tutor"}
                    </p>
                    <p className="text-xs text-[var(--secondary)]">
                      {c.status === "ACTIVE" ? "Active" : c.status === "PENDING_ESCROW" ? "Pending" : c.status.toLowerCase()}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
