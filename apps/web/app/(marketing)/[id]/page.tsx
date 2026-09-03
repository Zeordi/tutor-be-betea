"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const REVIEWS = [
  {
    name: "Hana T.",
    text: "Berhane is exceptional! My daughter's grade went from 65% to 88% in just 6 weeks.",
    stars: 5,
    date: "Aug 2026",
    child: "Grade 11 Math",
  },
  {
    name: "Abel M.",
    text: "Always prepared, patient with my son. Best tutor we've ever had. Highly recommend.",
    stars: 5,
    date: "Jul 2026",
    child: "Grade 9 Physics",
  },
  {
    name: "Tigist K.",
    text: "Very professional. Explains concepts clearly and tracks homework diligently.",
    stars: 5,
    date: "Jun 2026",
    child: "Grade 10 Math",
  },
];

const PACKAGES = [
  { label: "Hourly Session", detail: "450 ETB/hr · 60 or 90 min", popular: false },
  { label: "Starter Pack (8 hrs)", detail: "2,400 ETB · Save 800 ETB", popular: false },
  { label: "Monthly Intensive (20 hrs)", detail: "4,800 ETB · Most Popular", popular: true },
];

export default function TutorProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [tab, setTab] = useState<"overview" | "reviews" | "schedule">("overview");
  const [selectedPkg, setSelectedPkg] = useState(2);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <Link
          href="/tutors"
          className="mb-6 inline-flex text-sm font-semibold text-[var(--secondary)] hover:text-[var(--primary)]"
        >
          ← Back to Find Tutors
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px]">
          {/* Main */}
          <div>
            <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
              <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-start">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-teal-300 text-5xl">
                  👨‍🏫
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-black text-[var(--foreground)] md:text-[28px]">
                      Berhane Alemu
                    </h1>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#00A389] dark:bg-emerald-950/40">
                      ● Available Today
                    </span>
                  </div>
                  <p className="mb-3 text-[15px] text-[var(--secondary)]">
                    Mathematics & Physics · Grade 9–12 · Bole, Addis Ababa
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#00A389] px-3 py-1 text-xs font-bold text-white">
                      🪪 Fayda ID
                    </span>
                    <span className="rounded-full bg-[#0284C7] px-3 py-1 text-xs font-bold text-white">
                      🎓 Degree
                    </span>
                    <span className="rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-bold text-[#7C2D12]">
                      ⭐ Gold Tutor
                    </span>
                    <span className="rounded-full bg-[#7C3AED] px-3 py-1 text-xs font-bold text-white">
                      💎 Elite
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-[var(--secondary)]">Profile ID: {id}</p>
                </div>

                <div className="flex gap-5 md:shrink-0">
                  {[
                    ["4.9", "Rating"],
                    ["312", "Sessions"],
                    ["6", "Years Exp."],
                  ].map(([v, l]) => (
                    <div key={l} className="text-center">
                      <p className="text-2xl font-black text-[var(--primary)]">{v}</p>
                      <p className="text-xs text-[var(--secondary)]">{l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video placeholder */}
              <div className="relative mb-6 flex h-48 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--muted)] md:h-56">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-teal-300/10" />
                <div className="relative text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]">
                    <span className="ml-1 text-2xl text-white">▶</span>
                  </div>
                  <p className="text-sm font-bold text-[var(--foreground)]">Watch Intro Video</p>
                  <p className="text-xs text-[var(--secondary)]">
                    58 seconds · In Amharic & English
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6 flex gap-1 border-b border-[var(--border)]">
                {(["overview", "reviews", "schedule"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`px-5 py-2.5 text-sm font-bold capitalize transition ${
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
                <div>
                  <h3 className="mb-3 text-base font-extrabold text-[var(--foreground)]">
                    About Berhane
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-[var(--secondary)]">
                    I hold a BSc in Mathematics from Addis Ababa University and a minor in Physics
                    from the same institution. With over 6 years of tutoring experience, I specialize
                    in the Ethiopian National Curriculum for Grades 9–12. I believe every student can
                    excel with the right guidance and personalized approach. My sessions are highly
                    structured with AI-generated progress reports after every class.
                  </p>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="mb-2.5 text-[13px] font-bold text-[var(--foreground)]">
                        Subjects Taught
                      </p>
                      {[
                        "Mathematics (Grade 9–12)",
                        "Physics (Grade 11–12)",
                        "Statistics & Probability",
                      ].map((s) => (
                        <div
                          key={s}
                          className="border-b border-[var(--border)] py-1.5 text-[13px] text-[var(--secondary)]"
                        >
                          • {s}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="mb-2.5 text-[13px] font-bold text-[var(--foreground)]">
                        Education
                      </p>
                      {[
                        "BSc Mathematics, AAU (2018)",
                        "Teacher Training Cert. (2019)",
                        "IGCSE Tutor Certified (2021)",
                      ].map((e) => (
                        <div
                          key={e}
                          className="border-b border-[var(--border)] py-1.5 text-[13px] text-[var(--secondary)]"
                        >
                          🎓 {e}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === "reviews" && (
                <div>
                  <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-[var(--muted)] p-5 sm:flex-row sm:items-center sm:gap-6">
                    <div className="text-center">
                      <p className="text-5xl font-black text-amber-500">4.9</p>
                      <p className="text-sm text-amber-500">★★★★★</p>
                      <p className="text-xs text-[var(--secondary)]">312 reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((n) => (
                        <div key={n} className="flex items-center gap-2.5">
                          <span className="w-3 text-xs text-[var(--secondary)]">{n}</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--border)]">
                            <div
                              className="h-full rounded-full bg-amber-500"
                              style={{
                                width: n === 5 ? "91%" : n === 4 ? "7%" : "2%",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {REVIEWS.map((r, i) => (
                    <div
                      key={i}
                      className="mb-5 border-b border-[var(--border)] pb-5 last:mb-0 last:border-0"
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-teal-300 text-sm">
                            👩🏾
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[var(--foreground)]">{r.name}</p>
                            <p className="text-[11px] text-[var(--secondary)]">{r.child}</p>
                          </div>
                        </div>
                        <span className="text-xs text-[var(--secondary)]">{r.date}</span>
                      </div>
                      <p className="mb-1.5 text-sm text-amber-500">{"★".repeat(r.stars)}</p>
                      <p className="text-sm leading-relaxed text-[var(--secondary)]">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {tab === "schedule" && (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, di) => (
                    <div key={day}>
                      <p className="mb-2 text-center text-xs font-bold text-[var(--secondary)]">
                        {day}
                      </p>
                      {["9AM", "10AM", "11AM", "2PM", "3PM", "4PM"].map((slot, si) => {
                        const avail =
                          ([0, 2, 4].includes(di) && [0, 1, 3, 4].includes(si)) ||
                          ([1, 3].includes(di) && [2, 5].includes(si));
                        return (
                          <div
                            key={slot}
                            className={`mb-1 rounded-md px-1 py-1.5 text-center text-[10px] font-semibold ${
                              avail
                                ? "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40"
                                : "bg-[var(--muted)] text-[var(--border)]"
                            }`}
                          >
                            {avail ? slot : "–"}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking widget */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
              <p className="mb-1 text-[13px] font-semibold text-[var(--secondary)]">
                Starting from
              </p>
              <p className="mb-1 font-mono text-3xl font-black text-[var(--primary)]">
                450 ETB
                <span className="font-sans text-base font-semibold text-[var(--secondary)]">
                  /hr
                </span>
              </p>
              <p className="mb-6 text-xs text-[var(--secondary)]">
                or from 4,800 ETB/month package
              </p>

              <div className="mb-5 flex flex-col gap-2.5">
                {PACKAGES.map((p, i) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setSelectedPkg(i)}
                    className={`rounded-xl border-[1.5px] p-3.5 text-left transition ${
                      selectedPkg === i
                        ? "border-[var(--primary)] bg-teal-50 dark:bg-teal-950/30"
                        : "border-[var(--border)] bg-[var(--muted)]"
                    }`}
                  >
                    <p
                      className={`text-[13px] font-bold ${
                        selectedPkg === i
                          ? "text-[var(--primary)]"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {p.label}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--secondary)]">{p.detail}</p>
                  </button>
                ))}
              </div>

              <Link
                href="/register"
                className="mb-2.5 flex w-full items-center justify-center rounded-xl bg-[var(--primary)] py-3.5 text-[15px] font-bold text-white"
              >
                Book Now
              </Link>
              <Link
                href="/login"
                className="mb-4 flex w-full items-center justify-center rounded-xl border-[1.5px] border-[var(--border)] py-3 text-sm font-bold text-[var(--foreground)]"
              >
                Message Tutor
              </Link>

              <div className="flex flex-wrap justify-center gap-2">
                <span className="rounded-md bg-[#0072CE]/10 px-2.5 py-1 text-[11px] font-bold text-[#0072CE]">
                  Telebirr
                </span>
                <span className="rounded-md bg-[#8A1538]/10 px-2.5 py-1 text-[11px] font-bold text-[#8A1538]">
                  CBE Birr
                </span>
                <span className="rounded-md bg-[#00A859]/10 px-2.5 py-1 text-[11px] font-bold text-[#00A859]">
                  M-Pesa
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}