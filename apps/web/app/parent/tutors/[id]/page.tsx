"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch, paths } from "@/lib/api";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  author: { fullName: string; avatarUrl: string | null };
};

type Package = {
  id: string;
  name: string;
  sessions: number;
  priceEtb: number;
  description: string | null;
};

type Availability = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type TeacherProfile = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  subCity: string | null;
  status: string;
  bio: string | null;
  bioAm: string | null;
  videoIntroUrl: string | null;
  teachingStyles: string[];
  hourlyRate: number;
  monthlyRate: number;
  weekendRate: number | null;
  subjects: string[];
  grades: string[];
  rating: number;
  totalReviews: number;
  totalHoursTaught: number;
  badgeTier: string | null;
  isIdVerified: boolean;
  isEduVerified: boolean;
  isAvailable: boolean;
  maxTravelKm: number;
  packages: Package[];
  availability: Availability[];
  trustBadges: { type: string; issuedAt: string }[];
  reviews: Review[];
};

type Tab = "overview" | "reviews" | "schedule";

export default function ParentTutorProfilePage() {
  const params = useParams();
  const id = (params?.id as string) || "1";
  const [tab, setTab] = useState<Tab>("overview");
  const [pack, setPack] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<TeacherProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<TeacherProfile>(paths.teacher(id))
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load tutor");
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
      <div className="space-y-4 p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{error || "Tutor not found"}</p>
        <Link
          href="/parent/tutors"
          className="mt-3 inline-flex text-sm font-semibold text-[var(--secondary)] hover:text-[var(--primary)]"
        >
          ← Back to Find Tutors
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/parent/tutors"
        className="mb-4 inline-flex text-sm font-semibold text-[var(--secondary)] hover:text-[var(--primary)]"
      >
        ← Back to Find Tutors
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px]">
        {/* Main */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-7">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-teal-300 text-4xl">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                "👨‍🏫"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black text-[var(--foreground)]">
                {profile.fullName}
              </h1>
              <p className="mb-2 text-sm text-[var(--secondary)]">
                {profile.subjects.join(", ")} · {profile.grades.join(", ")} ·{" "}
                {profile.subCity || "Online"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.isIdVerified && (
                  <span className="rounded-full bg-[#00A389] px-2.5 py-1 text-[11px] font-bold text-white">
                    🪪 Fayda ID
                  </span>
                )}
                {profile.isEduVerified && (
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-[var(--primary)] dark:bg-teal-950/40">
                    🎓 Degree
                  </span>
                )}
                {profile.badgeTier && (
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-[var(--primary)] dark:bg-teal-950/40">
                    👮 BG Check
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-5">
              {[
                [profile.rating.toFixed(1), "Rating"],
                [String(profile.totalHoursTaught || 0), "Sessions"],
                [profile.totalHoursTaught ? `${Math.floor(profile.totalHoursTaught / 10)} yrs` : "—", "Exp."],
              ].map(([v, l]) => (
                <div key={l} className="text-center">
                  <p className="text-xl font-black text-[var(--primary)]">{v}</p>
                  <p className="text-[11px] text-[var(--secondary)]">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Video */}
          {profile.videoIntroUrl ? (
            <div className="relative mb-5 flex h-44 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--muted)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-teal-300/10" />
              <div className="relative text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                  ▶
                </div>
                <p className="text-sm font-bold text-[var(--foreground)]">
                  Intro Video · 58 sec
                </p>
                <p className="text-xs text-[var(--secondary)]">Amharic & English</p>
              </div>
            </div>
          ) : (
            <div className="relative mb-5 flex h-44 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)]">
              <p className="text-sm text-[var(--secondary)]">No intro video yet</p>
            </div>
          )}

          <div className="mb-5 flex gap-1 border-b border-[var(--border)]">
            {(["overview", "reviews", "schedule"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-[13px] font-bold capitalize ${
                  tab === t
                    ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                    : "text-[var(--secondary)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-[var(--secondary)]">
                {profile.bio || "No bio provided yet."}
              </p>
              {profile.bioAm && (
                <p className="text-sm leading-relaxed text-[var(--secondary)]">
                  {profile.bioAm}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {profile.teachingStyles.map((style) => (
                  <span
                    key={style}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>
          )}

          {tab === "reviews" && (
            <div className="space-y-4">
              {profile.reviews.length === 0 && (
                <p className="text-sm text-slate-400">No reviews yet.</p>
              )}
              {profile.reviews.map((r) => (
                <div
                  key={r.id}
                  className="border-b border-[var(--border)] pb-4 last:border-0"
                >
                  <p className="text-sm text-amber-500">{"★".repeat(r.rating)}</p>
                  <p className="mt-1 text-sm font-bold text-[var(--foreground)]">
                    {r.author.fullName}{" "}
                    <span className="font-normal text-[var(--secondary)]">
                      · {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-[var(--secondary)]">
                    {r.comment || "No comment"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {tab === "schedule" && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, di) => (
                <div key={d}>
                  <p className="mb-1.5 text-center text-[11px] font-bold text-[var(--secondary)]">
                    {d}
                  </p>
                  {["9AM", "10AM", "11AM", "2PM", "3PM"].map((s, si) => {
                    const av = profile.availability.some(
                      (a) =>
                        a.dayOfWeek === di + 1 &&
                        a.startTime <= s &&
                        a.endTime >= s,
                    );
                    return (
                      <div
                        key={s}
                        className={`mb-1 rounded-md py-1 text-center text-[9px] font-semibold ${
                          av
                            ? "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40"
                            : "bg-[var(--muted)] text-[var(--border)]"
                        }`}
                      >
                        {av ? s : "–"}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky booking */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
            <p className="text-[13px] text-[var(--secondary)]">From</p>
            <p className="mb-4 font-mono text-3xl font-black text-[var(--primary)]">
              {profile.hourlyRate} ETB<span className="text-sm font-semibold text-[var(--secondary)]">/hr</span>
            </p>
            <div className="mb-4 space-y-2">
              {profile.packages.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPack(i)}
                  className={`w-full rounded-[10px] border p-3 text-left ${
                    pack === i
                      ? "border-[var(--primary)] bg-teal-50 dark:bg-teal-950/30"
                      : "border-[var(--border)] bg-[var(--muted)]"
                  }`}
                >
                  <p
                    className={`text-[13px] font-bold ${
                      pack === i ? "text-[var(--primary)]" : "text-[var(--foreground)]"
                    }`}
                  >
                    {p.name}
                  </p>
                  <p className="text-xs text-[var(--secondary)]">
                    {p.sessions} sessions · {p.priceEtb.toLocaleString()} ETB
                  </p>
                </button>
              ))}
            </div>
            <Link
              href="/parent/checkout"
              className="mb-2 flex w-full items-center justify-center rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white"
            >
              Book Now — Escrow Protected
            </Link>
            <Link
              href={`/parent/chat/${id}`}
              className="mb-3 flex w-full items-center justify-center rounded-xl border border-[var(--border)] py-2.5 text-sm font-bold text-[var(--foreground)]"
            >
              💬 Send Message
            </Link>
            <div className="flex flex-wrap justify-center gap-1.5">
              {["Telebirr", "CBE Birr", "M-Pesa"].map((p, i) => (
                <span
                  key={p}
                  className="rounded px-2 py-0.5 text-[10px] font-bold"
                  style={{
                    background: ["#0072CE18", "#8A153818", "#00A85918"][i],
                    color: ["#0072CE", "#8A1538", "#00A859"][i],
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4">
            <p className="mb-1 text-sm font-bold text-[var(--foreground)]">
              Already a student?
            </p>
            <p className="mb-3 text-xs text-[var(--secondary)]">
              {profile.fullName} is assigned to one of your children. View progress
              reports.
            </p>
            <Link
              href="/parent/progress"
              className="text-sm font-bold text-[var(--primary)]"
            >
              View Progress Reports →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
