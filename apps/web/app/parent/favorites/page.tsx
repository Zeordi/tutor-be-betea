"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type SavedTeacher = {
  id: string;
  createdAt: string;
  teacher: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    teacherProfile: {
      hourlyRate: number;
      rating: number;
      subCity: string | null;
    } | null;
  };
};

export default function ParentFavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<SavedTeacher[]>([]);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<SavedTeacher[]>(paths.favorites)
      .then((data) => {
        if (!cancelled) setSaved(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load favorites");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const remove = async (teacherId: string) => {
    setRemoving(teacherId);
    try {
      await apiFetch(paths.favorite(teacherId), { method: "DELETE" });
      setSaved((prev) => prev.filter((f) => f.teacher.id !== teacherId));
    } catch (err: any) {
      alert(err.message || "Failed to remove");
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Saved Tutors</h1>
          <p className="text-sm text-[var(--secondary)]">
            Bookmarked tutors for quick booking · {saved.length} saved
          </p>
        </div>
        <Link
          href="/parent/tutors"
          className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
        >
          Find more tutors
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {saved.map((t) => {
          const tp = t.teacher.teacherProfile;
          const rate = tp?.hourlyRate || 0;
          const rating = tp?.rating || 0;
          const city = tp?.subCity || "—";
          return (
            <div
              key={t.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)] text-sm font-black text-white">
                  {t.teacher.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-[var(--foreground)]">{t.teacher.fullName}</p>
                    <p className="shrink-0 font-mono text-sm font-extrabold text-[var(--primary)]">
                      {rate}
                      <span className="font-sans text-[10px] font-semibold text-[var(--secondary)]">
                        {" "}
                        ETB/hr
                      </span>
                    </p>
                  </div>
                  <p className="text-sm text-[var(--secondary)]">{city}</p>
                  <p className="mt-1 text-xs text-[var(--secondary)]">
                    ⭐ {rating.toFixed(1)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/parent/tutors/${t.teacher.id}`}
                  className="flex-1 rounded-xl bg-[var(--primary)] py-2.5 text-center text-xs font-bold text-white"
                >
                  View & book
                </Link>
                <button
                  type="button"
                  onClick={() => remove(t.teacher.id)}
                  disabled={removing === t.teacher.id}
                  className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-xs font-bold text-[var(--secondary)]"
                >
                  {removing === t.teacher.id ? "Removing…" : "Remove"}
                </button>
              </div>
            </div>
          );
        })}

        {saved.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
            <p className="text-3xl">🤍</p>
            <p className="mt-2 font-bold text-[var(--foreground)]">No saved tutors yet</p>
            <p className="mt-1 text-sm text-[var(--secondary)]">
              Bookmark tutors from Find Tutors to book faster later.
            </p>
            <Link
              href="/parent/tutors"
              className="mt-4 inline-block font-bold text-[var(--primary)]"
            >
              Browse tutors →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
