"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

type TeacherMe = {
  id: string;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  subCity: string | null;
  avatarUrl: string | null;
  status: string | null;
  bio: string | null;
  bioAm: string | null;
  hourlyRate: number;
  monthlyRate: number;
  weekendRate: number | null;
  subjects: string[];
  grades: string[];
  teachingStyles: string[];
  tagline: string | null;
  introVideoUrl: string | null;
  rating: number;
  totalReviews: number;
  totalHoursTaught: number;
  badgeTier: string | null;
  isIdVerified: boolean;
  isEduVerified: boolean;
  isAvailable: boolean;
  maxTravelKm: number;
  packages: any[];
  availability: any[];
  trustBadges: any[];
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
  const [rawMe, setRawMe] = useState<TeacherMe | null>(null);
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

  const me = useMemo(() => {
    if (!rawMe) return null;
    return {
      ...rawMe,
      fullName: rawMe.fullName || "Teacher",
      email: rawMe.email || "",
      phoneNumber: rawMe.phoneNumber || "",
      subCity: rawMe.subCity || "",
      avatarUrl: rawMe.avatarUrl || null,
      status: rawMe.status || "",
      bio: rawMe.bio || "",
      bioAm: rawMe.bioAm || "",
      hourlyRate: Number(rawMe.hourlyRate || 0),
      monthlyRate: Number(rawMe.monthlyRate || 0),
      weekendRate: rawMe.weekendRate != null ? Number(rawMe.weekendRate) : null,
      subjects: Array.isArray(rawMe.subjects) ? rawMe.subjects : [],
      grades: Array.isArray(rawMe.grades) ? rawMe.grades : [],
      teachingStyles: Array.isArray(rawMe.teachingStyles) ? rawMe.teachingStyles : [],
      tagline: rawMe.tagline || "",
      introVideoUrl: rawMe.introVideoUrl || null,
      rating: Number(rawMe.rating || 0),
      totalReviews: Number(rawMe.totalReviews || 0),
      totalHoursTaught: Number(rawMe.totalHoursTaught || 0),
      badgeTier: rawMe.badgeTier || null,
      isIdVerified: Boolean(rawMe.isIdVerified),
      isEduVerified: Boolean(rawMe.isEduVerified),
      isAvailable: Boolean(rawMe.isAvailable),
      maxTravelKm: Number(rawMe.maxTravelKm || 0),
      packages: Array.isArray(rawMe.packages) ? rawMe.packages : [],
      availability: Array.isArray(rawMe.availability) ? rawMe.availability : [],
      trustBadges: Array.isArray(rawMe.trustBadges) ? rawMe.trustBadges : [],
    };
  }, [rawMe]);

  const profileStrength = useMemo(() => {
    if (!me) return 0;
    let score = 0;
    if (me.bio && me.bio.trim().length > 0) score += 25;
    if (me.subjects.length > 0) score += 25;
    if (me.grades.length > 0) score += 15;
    if (me.rating > 0) score += 15;
    if (me.isIdVerified || me.isEduVerified) score += 20;
    return Math.min(score, 100);
  }, [me]);

  const previewChecklist = useMemo(() => {
    if (!me) return [];
    return [
      { label: "Profile photo", done: !!me.avatarUrl || !!me.fullName },
      { label: "Bio", done: !!me.bio && me.bio.trim().length > 0 },
      { label: "Subjects", done: me.subjects.length > 0 },
      { label: "Grades", done: me.grades.length > 0 },
      { label: "ID Verified", done: me.isIdVerified },
      { label: "Education Verified", done: me.isEduVerified },
      { label: "Reviews", done: me.totalReviews > 0 },
    ];
  }, [me]);

  const doneCount = previewChecklist.filter((c) => c.done).length;

  const initials = useMemo(() => {
    if (!me?.fullName) return "T";
    return me.fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [me?.fullName]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<TeacherMe>(paths.teachersMeProfile)
      .then((data) => {
        if (!cancelled) {
          setRawMe(data);
          if (data?.teachingStyles) {
            setActiveStyles(data.teachingStyles);
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

    try {
      await apiFetch(paths.teachersProfileUpdate, {
        method: "PATCH",
        body: JSON.stringify({
          hourlyRate: me.hourlyRate,
          subjects: me.subjects,
          grades: me.grades,
          teachingStyles: activeStyles,
          bio: me.bio,
          bioAm: me.bioAm,
          tagline: me.tagline,
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
      <div className="mx-auto max-w-5xl space-y-5 p-4 md:p-8">
        <div className="h-7 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
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

  if (!me) {
    return (
      <div className="p-6">
        <p className="text-sm text-[var(--secondary)]">No profile data.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">My Profile & Showcase</h1>
          <p className="text-sm text-[var(--secondary)]">
            {doneCount}/{previewChecklist.length} profile items complete
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saved}
          className="w-full rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white disabled:opacity-70 sm:w-auto"
        >
          {saved ? "✓ Saved" : "Edit Profile"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xl font-black text-white sm:h-20 sm:w-20">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{me.fullName}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {(me.subjects || []).join(", ")}
                  {(me.grades || []).length > 0 ? ` · ${(me.grades || []).join(", ")}` : ""}
                  {me.subCity ? ` · ${me.subCity}` : ""}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {me.isIdVerified && (
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                      🛡️ ID Verified
                    </span>
                  )}
                  {me.isEduVerified && (
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                      🎓 Degree Verified
                    </span>
                  )}
                  {me.badgeTier && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                      {me.badgeTier}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-lg font-black text-teal-600">{me.rating > 0 ? me.rating.toFixed(1) : "—"}</p>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Rating</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-lg font-black text-teal-600">{me.totalReviews}</p>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Reviews</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-lg font-black text-teal-600">{me.totalHoursTaught}</p>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Hours</p>
              </div>
            </div>

            {me.bio && (
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">About</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{me.bio}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Bio & Tagline</p>
            <Field label="Professional Tagline" defaultValue={me.tagline || ""} />
            <Field label="Bio (EN)" multiline defaultValue={me.bio || ""} />
            <Field label="Bio (አማርኛ)" multiline defaultValue={me.bioAm || ""} />
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subjects Taught</p>
              <button type="button" className="text-xs font-bold text-teal-600">
                + Add
              </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {(me.subjects || []).map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="mb-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">Grade Levels</p>
            <div className="flex flex-wrap gap-2">
              {(me.grades || []).map((g) => (
                <span
                  key={g}
                  className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Teaching Styles</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(me.teachingStyles || []).map((style) => (
                <span
                  key={style}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Rates (ETB)</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Home Visit / hr</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{me.hourlyRate ?? 0} ETB</p>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Online / hr</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{me.monthlyRate ?? 0} ETB</p>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Group Session / hr</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{me.weekendRate ?? 0} ETB</p>
              </div>
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

        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-white">Public Profile Preview</h3>
            <p className="mb-3 text-[10px] font-semibold text-slate-400">What parents see when viewing your profile</p>
            <div className="space-y-2">
              {previewChecklist.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-300">{item.label}</span>
                  <span
                    className={`text-[10px] font-bold ${
                      item.done ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                    }`}
                  >
                    {item.done ? "Visible" : "Hidden"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <h3 className="mb-1 text-sm font-bold text-slate-800 dark:text-white">Profile Strength</h3>
            <p className="mb-3 text-[10px] text-slate-400">Based on completed profile sections</p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-teal-600"
                    style={{ width: `${profileStrength}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-black text-teal-600">{profileStrength}%</span>
            </div>
            <p className="mt-2 text-[10px] text-slate-400">
              {profileStrength < 50
                ? "Complete more sections to improve visibility."
                : profileStrength < 80
                ? "Looking good! Add a bio to reach 100%."
                : "Excellent profile — you stand out to parents."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
            <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-white">Trust Badges</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300">ID Verification</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    me.isIdVerified
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {me.isIdVerified ? "Active" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300">Education Verification</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    me.isEduVerified
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {me.isEduVerified ? "Active" : "Pending"}
                </span>
              </div>
              {me.badgeTier && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-300">Badge Tier</span>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                    {me.badgeTier}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
