"use client";

import { useState } from "react";
import Link from "next/link";

const PARENT_STEPS = [
  {
    n: "01",
    icon: "🔍",
    title: "Search & Filter",
    desc: "Browse verified tutors by subject, sub-city, curriculum (National or Cambridge), rating, and price.",
  },
  {
    n: "02",
    icon: "📅",
    title: "Book a Session or Package",
    desc: "Pick a time slot or monthly package. See live ETB pricing before you confirm.",
  },
  {
    n: "03",
    icon: "🔒",
    title: "Pay into Escrow",
    desc: "Pay with Telebirr, CBE Birr, or M-Pesa. Funds stay protected until sessions are verified.",
  },
  {
    n: "04",
    icon: "📍",
    title: "Geofenced Session",
    desc: "Tutor checks in within 150m of your home. Attendance is logged automatically.",
  },
  {
    n: "05",
    icon: "📊",
    title: "Progress Reports",
    desc: "AI-assisted weekly mastery reports show strengths, focus areas, and next-session plans.",
  },
  {
    n: "06",
    icon: "🔄",
    title: "Replacement Guarantee",
    desc: "Not satisfied? Request a free replacement. Escrow carries over to the new tutor.",
  },
];

const TUTOR_STEPS = [
  {
    n: "01",
    icon: "📝",
    title: "Create Your Profile",
    desc: "Add bio, subjects, grades, rates, and teaching style. EN + አማርኛ supported.",
  },
  {
    n: "02",
    icon: "🪪",
    title: "Fayda + Degree Verify",
    desc: "Upload National ID and degree into the encrypted vault. Earn Trust Badges when approved.",
  },
  {
    n: "03",
    icon: "💼",
    title: "Apply to Jobs",
    desc: "Browse parent jobs near you. Spend Connects to apply with a short pitch.",
  },
  {
    n: "04",
    icon: "📅",
    title: "Set Availability",
    desc: "Weekly slots, vacation blocks, and package offers parents can book instantly.",
  },
  {
    n: "05",
    icon: "✅",
    title: "Deliver & Check In",
    desc: "Geofenced check-in/out. Submit progress reports parents can approve.",
  },
  {
    n: "06",
    icon: "💰",
    title: "Get Paid",
    desc: "Escrow releases after verified attendance. Withdraw to Telebirr or CBE Birr.",
  },
];

export default function HowItWorksPage() {
  const [tab, setTab] = useState<"parent" | "tutor">("parent");
  const steps = tab === "parent" ? PARENT_STEPS : TUTOR_STEPS;

  return (
    <main className="bg-[var(--background)]">
      {/* Hero */}
      <section className="border-b border-[var(--border)] bg-gradient-to-b from-teal-50/80 to-[var(--background)] px-4 py-16 dark:from-[#0A1628] dark:to-[var(--background)] md:px-6 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)]">
            Simple & Safe
          </p>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-[var(--foreground)] md:text-5xl">
            How Tutor Be Betea Works
          </h1>
          <p className="mx-auto max-w-xl text-base text-[var(--secondary)] md:text-lg">
            Built for Ethiopian families and tutors — escrow payments, Fayda verification, and
            geofenced sessions from day one.
          </p>

          <div className="mx-auto mt-8 inline-flex rounded-xl border border-[var(--border)] bg-[var(--card)] p-1">
            {(["parent", "tutor"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-lg px-5 py-2.5 text-sm font-bold capitalize transition ${
                  tab === t
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-[var(--secondary)] hover:text-[var(--foreground)]"
                }`}
              >
                {t === "parent" ? "👪 For Parents" : "🧑‍🏫 For Tutors"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8"
            >
              <div className="absolute right-5 top-4 text-4xl font-black text-[var(--primary)]/15 md:text-5xl">
                {s.n}
              </div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-2xl dark:bg-teal-950/40">
                {s.icon}
              </div>
              <h3 className="mb-2 text-lg font-extrabold text-[var(--foreground)]">{s.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--secondary)]">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {tab === "parent" ? (
            <>
              <Link
                href="/tutors"
                className="w-full rounded-xl bg-[var(--primary)] px-8 py-3.5 text-center text-sm font-bold text-white sm:w-auto"
              >
                Find a Tutor →
              </Link>
              <Link
                href="/register"
                className="w-full rounded-xl border border-[var(--border)] px-8 py-3.5 text-center text-sm font-bold text-[var(--foreground)] sm:w-auto"
              >
                Create Parent Account
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/for-tutors"
                className="w-full rounded-xl bg-[var(--primary)] px-8 py-3.5 text-center text-sm font-bold text-white sm:w-auto"
              >
                Become a Tutor →
              </Link>
              <Link
                href="/register"
                className="w-full rounded-xl border border-[var(--border)] px-8 py-3.5 text-center text-sm font-bold text-[var(--foreground)] sm:w-auto"
              >
                Create Tutor Account
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-[var(--border)] bg-[var(--card)] px-4 py-12 md:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["🛡️", "Fayda ID Verified"],
            ["🔒", "Escrow Payments"],
            ["📍", "150m Geofence"],
            ["🔄", "100% Replacement"],
          ].map(([icon, label]) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <span className="text-sm font-bold text-[var(--foreground)]">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}