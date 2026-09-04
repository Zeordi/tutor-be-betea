"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const REVIEWS = [
  {
    name: "Hana T.",
    text: "My daughter improved from 65% to 88% in 6 weeks!",
    stars: 5,
    child: "Grade 11 Math",
  },
  {
    name: "Abel M.",
    text: "Always prepared and patient. Highly recommend.",
    stars: 5,
    child: "Grade 9 Physics",
  },
  {
    name: "Tigist K.",
    text: "Very professional with clear explanations.",
    stars: 4,
    child: "Grade 10 Math",
  },
];

const PACKS = [
  { label: "Single Session", detail: "450 ETB/hr · 60 or 90 min", popular: false },
  { label: "8-hr Pack", detail: "2,400 ETB · Save 800", popular: false },
  { label: "Monthly (20hr)", detail: "4,800 ETB · Popular", popular: true },
];

export default function ParentTutorProfilePage() {
  const params = useParams();
  const id = (params?.id as string) || "1";
  const [tab, setTab] = useState<"overview" | "reviews" | "schedule">("overview");
  const [pack, setPack] = useState(2);

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
              👨‍🏫
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black text-[var(--foreground)]">
                Berhane Alemu
              </h1>
              <p className="mb-2 text-sm text-[var(--secondary)]">
                Mathematics & Physics · Grade 9–12 · Bole
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#00A389] px-2.5 py-1 text-[11px] font-bold text-white">
                  🪪 Fayda ID
                </span>
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-[var(--primary)] dark:bg-teal-950/40">
                  🎓 Degree
                </span>
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-[var(--primary)] dark:bg-teal-950/40">
                  👮 BG Check
                </span>
              </div>
            </div>
            <div className="flex gap-5">
              {[["4.9", "Rating"], ["312", "Sessions"], ["6 yrs", "Exp."]].map(
                ([v, l]) => (
                  <div key={l} className="text-center">
                    <p className="text-xl font-black text-[var(--primary)]">{v}</p>
                    <p className="text-[11px] text-[var(--secondary)]">{l}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Video */}
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
            <p className="text-sm leading-relaxed text-[var(--secondary)]">
              BSc in Mathematics from AAU. 6+ years tutoring Grades 9–12. Specializes
              in National Curriculum exam preparation. AI-generated session reports after
              every class. In-person (Bole) and online. Profile id: {id}
            </p>
          )}

          {tab === "reviews" && (
            <div className="space-y-4">
              {REVIEWS.map((r) => (
                <div
                  key={r.name}
                  className="border-b border-[var(--border)] pb-4 last:border-0"
                >
                  <p className="text-sm text-amber-500">{"★".repeat(r.stars)}</p>
                  <p className="mt-1 text-sm font-bold text-[var(--foreground)]">
                    {r.name}{" "}
                    <span className="font-normal text-[var(--secondary)]">
                      · {r.child}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-[var(--secondary)]">{r.text}</p>
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
                    const av = [0, 2, 4].includes(di) && [0, 1, 3].includes(si);
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
              450 ETB<span className="text-sm font-semibold text-[var(--secondary)]">/hr</span>
            </p>
            <div className="mb-4 space-y-2">
              {PACKS.map((p, i) => (
                <button
                  key={p.label}
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
                    {p.label}
                  </p>
                  <p className="text-xs text-[var(--secondary)]">{p.detail}</p>
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
              Kidist is assigned to Berhane. View progress reports.
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