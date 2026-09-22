"use client";

import { useEffect, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

type TeacherMe = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  subCity: string | null;
  teacherProfile: {
    hourlyRate: number;
    hourlyRateOnline: number;
    hourlyRateGroup: number;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    idVerified: boolean;
    degreeVerified: boolean;
    badgeLevel: string;
    subjects: string[];
    gradeLevels: string[];
    certificates: string[];
    teachingStyles: string[];
    bioEn: string | null;
    bioAm: string | null;
    tagline: string | null;
    introVideoUrl: string | null;
  } | null;
};

type FieldProps = {
  label: string;
  defaultValue: string;
  multiline?: boolean;
};

function Field({ label, defaultValue, multiline }: FieldProps) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-[10px] font-semibold text-[var(--secondary)]">{label}</span>
      {multiline ? (
        <textarea
          defaultValue={defaultValue}
          rows={3}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2.5 text-sm text-[var(--foreground)]"
        />
      ) : (
        <input
          defaultValue={defaultValue}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2.5 text-sm text-[var(--foreground)]"
        />
      )}
    </label>
  );
}

export default function TeacherProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState<TeacherMe | null>(null);
  const [activeStyles, setActiveStyles] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const STYLES = [
    "Interactive",
    "Structured",
    "Visual",
    "Patient",
    "Exam-Focused",
    "Bilingual EN/አማ",
  ];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<TeacherMe>(paths.usersMe)
      .then((data) => {
        if (!cancelled) {
          setMe(data);
          if (data?.teacherProfile?.teachingStyles) {
            setActiveStyles(data.teacherProfile.teachingStyles);
          }
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load profile");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    if (!me) return;
    const tp = me.teacherProfile;

    try {
      await apiFetch(paths.teachersProfileUpdate, {
        method: "PATCH",
        body: JSON.stringify({
          hourlyRate: tp?.hourlyRate,
          subjects: tp?.subjects,
          gradeLevels: tp?.gradeLevels,
          teachingStyles: activeStyles,
          bioEn: tp?.bioEn,
          bioAm: tp?.bioAm,
          tagline: tp?.tagline,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to save");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 p-6">
        <div className="h-6 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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

  if (!me) {
    return <div className="p-6"><p className="text-sm text-[var(--secondary)]">No profile data.</p></div>;
  }

  const tp = me.teacherProfile;
  const initials = me.fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const badgeText = tp?.isVerified
    ? "🛡️ ID Verified · 🎓 Degree Verified"
    : "⚠️ Verification in progress";

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Edit Profile</h1>
          <p className="text-sm text-[var(--secondary)]">Showcase your expertise · Trust Badges only publicly</p>
        </div>
        <button
          type="button"
          className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--secondary)]"
        >
          Preview public
        </button>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">
          PROFILE PHOTO & INTRO VIDEO
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)] text-2xl font-extrabold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-extrabold text-[var(--foreground)]">{me.fullName}</p>
            <p className="mb-2 text-sm text-[var(--secondary)]">
              {(tp?.subjects || []).join(", ")} · {tp?.gradeLevels?.join(", ") || ""}
            </p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {badgeText.split(" · ").map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
                >
                  {b}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="w-full rounded-xl border border-dashed border-[var(--border)] py-3 text-xs font-semibold text-[var(--secondary)] sm:w-auto sm:px-4"
            >
              🎬 Add Video Introduction (max 90 sec)
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">BIO & TAGLINE</p>
        <Field
          label="Professional Tagline"
          defaultValue={tp?.tagline || ""}
        />
        <Field
          label="Bio (EN)"
          multiline
          defaultValue={tp?.bioEn || ""}
        />
        <Field
          label="Bio (አማርኛ)"
          multiline
          defaultValue={tp?.bioAm || ""}
        />
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-wide text-[var(--secondary)]">SUBJECTS TAUGHT</p>
          <button type="button" className="text-xs font-bold text-[var(--primary)]">
            + Add
          </button>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {(tp?.subjects || []).map((s) => (
            <span
              key={s}
              className="rounded-full border border-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]"
            >
              {s} ×
            </span>
          ))}
        </div>
        <p className="mb-2 text-[10px] font-semibold text-[var(--secondary)]">Grade Levels</p>
        <div className="flex gap-2">
          {(tp?.gradeLevels || []).map((g) => (
            <span
              key={g}
              className="flex-1 rounded-xl border py-2 text-center text-xs font-bold border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-wide text-[var(--secondary)]">CERTIFICATIONS</p>
          <button type="button" className="text-xs font-bold text-[var(--primary)]">
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {(tp?.certificates || []).map((c) => (
            <div key={c} className="flex items-center gap-2 rounded-xl bg-[var(--muted)] p-3">
              <span>🎓</span>
              <p className="text-xs font-semibold text-[var(--foreground)]">{c}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">RATES (ETB)</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <p className="flex-1 text-sm font-semibold text-[var(--foreground)]">Home Visit / hr</p>
            <div className="flex w-28 items-center rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2">
              <span className="text-[10px] text-[var(--secondary)]">ETB </span>
              <span className="font-extrabold text-[var(--foreground)]">{tp?.hourlyRate ?? 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="flex-1 text-sm font-semibold text-[var(--foreground)]">Online / hr</p>
            <div className="flex w-28 items-center rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2">
              <span className="text-[10px] text-[var(--secondary)]">ETB </span>
              <span className="font-extrabold text-[var(--foreground)]">{tp?.hourlyRateOnline ?? 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="flex-1 text-sm font-semibold text-[var(--foreground)]">Group Session / hr</p>
            <div className="flex w-28 items-center rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2">
              <span className="text-[10px] text-[var(--secondary)]">ETB </span>
              <span className="font-extrabold text-[var(--foreground)]">{tp?.hourlyRateGroup ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">
          TEACHING STYLE TAGS
        </p>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((t) => {
            const on = activeStyles.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() =>
                  setActiveStyles((prev) =>
                    on ? prev.filter((x) => x !== t) : [...prev, t]
                  )
                }
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  on
                    ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300"
                    : "border-[var(--border)] text-[var(--secondary)]"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saved}
        className="w-full rounded-2xl bg-[var(--primary)] py-3.5 text-sm font-extrabold text-white disabled:opacity-70"
      >
        {saved ? "✓ Saved & Published" : "Save & Publish Profile"}
      </button>
    </div>
  );
}
