"use client";

import { useState } from "react";

const SUBJECTS = ["Mathematics", "Physics", "Statistics"];
const CERTS = [
  "BSc Applied Mathematics · Addis Ababa Univ.",
  "CELTA English Teaching Certificate",
];
const RATES = [
  { label: "Home Visit / hr", value: "450" },
  { label: "Online / hr", value: "350" },
  { label: "Group Session / hr", value: "250" },
];
const STYLES = [
  "Interactive",
  "Structured",
  "Visual",
  "Patient",
  "Exam-Focused",
  "Bilingual EN/አማ",
];

export default function TeacherProfilePage() {
  const [activeStyles, setActiveStyles] = useState([
    "Interactive",
    "Structured",
    "Visual",
    "Patient",
  ]);
  const [saved, setSaved] = useState(false);

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

      {/* Photo + intro */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">
          PROFILE PHOTO & INTRO VIDEO
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)] text-2xl font-extrabold text-white">
            HB
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-extrabold text-[var(--foreground)]">Hana Bekele</p>
            <p className="mb-2 text-sm text-[var(--secondary)]">Mathematics · Physics · 3+ years</p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {["🛡️ ID Verified", "🎓 Degree Verified"].map((b) => (
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

      {/* Bio */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">BIO & TAGLINE</p>
        <Field
          label="Professional Tagline"
          defaultValue="Expert Math tutor · 4.9★ · Bole & CMC home visits"
        />
        <Field
          label="Bio (EN)"
          multiline
          defaultValue="I hold a BSc in Applied Mathematics from Addis Ababa University and have 3+ years of home and online tutoring experience."
        />
        <Field
          label="Bio (አማርኛ)"
          multiline
          defaultValue="ሂሳብን ቀላልና አስደሳች ለማድረግ ከ3 ዓመት በላይ ተሞክሮ አለኝ።"
        />
      </div>

      {/* Subjects */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-wide text-[var(--secondary)]">SUBJECTS TAUGHT</p>
          <button type="button" className="text-xs font-bold text-[var(--primary)]">
            + Add
          </button>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
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
          {["9", "10", "11", "12"].map((g) => (
            <span
              key={g}
              className={`flex-1 rounded-xl border py-2 text-center text-xs font-bold ${
                g !== "9"
                  ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--secondary)]"
              }`}
            >
              Gr {g}
            </span>
          ))}
        </div>
      </div>

      {/* Certs */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-wide text-[var(--secondary)]">CERTIFICATIONS</p>
          <button type="button" className="text-xs font-bold text-[var(--primary)]">
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {CERTS.map((c) => (
            <div key={c} className="flex items-center gap-2 rounded-xl bg-[var(--muted)] p-3">
              <span>🎓</span>
              <p className="text-xs font-semibold text-[var(--foreground)]">{c}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rates */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="mb-3 text-[10px] font-bold tracking-wide text-[var(--secondary)]">RATES (ETB)</p>
        <div className="space-y-2">
          {RATES.map((r) => (
            <div key={r.label} className="flex items-center gap-3">
              <p className="flex-1 text-sm font-semibold text-[var(--foreground)]">{r.label}</p>
              <div className="flex w-28 items-center rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2">
                <span className="text-[10px] text-[var(--secondary)]">ETB </span>
                <span className="font-extrabold text-[var(--foreground)]">{r.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Styles */}
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
        onClick={() => setSaved(true)}
        className="w-full rounded-2xl bg-[var(--primary)] py-3.5 text-sm font-extrabold text-white"
      >
        {saved ? "✓ Saved & Published" : "Save & Publish Profile"}
      </button>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  multiline,
}: {
  label: string;
  defaultValue: string;
  multiline?: boolean;
}) {
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