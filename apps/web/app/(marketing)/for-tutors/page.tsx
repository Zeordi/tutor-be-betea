"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const PIPELINE = [
  {
    n: 1,
    icon: "📝",
    title: "Application",
    desc: "Complete profile with bio, subjects, and teaching experience",
  },
  {
    n: 2,
    icon: "🪪",
    title: "Fayda ID Check",
    desc: "National ID verified against Ethiopia's Fayda biometric system",
  },
  {
    n: 3,
    icon: "🎓",
    title: "Degree Auth.",
    desc: "University certificate validated with the institution",
  },
  {
    n: 4,
    icon: "👮",
    title: "Police Check",
    desc: "Federal Police Commission clearance certificate",
  },
  {
    n: 5,
    icon: "✅",
    title: "Live on Platform",
    desc: "Earn Trust Badges and accept your first booking",
  },
];

const BENEFITS = [
  {
    icon: "💰",
    title: "Fair ETB earnings",
    desc: "Set your own rates. Top tutors earn 15,000–25,000+ ETB/month.",
  },
  {
    icon: "🛡️",
    title: "Trust Badges",
    desc: "Fayda + Degree badges boost parent confidence and bookings.",
  },
  {
    icon: "📍",
    title: "Local matching",
    desc: "PostGIS matching prefers tutors near the family — less travel.",
  },
  {
    icon: "🔒",
    title: "Escrow protection",
    desc: "Get paid after verified sessions. No chase for cash.",
  },
  {
    icon: "📱",
    title: "Telebirr & CBE payouts",
    desc: "Withdraw earnings to local rails you already use.",
  },
  {
    icon: "🚫",
    title: "Anti-poaching chat",
    desc: "Platform messaging keeps relationships and payments safe.",
  },
];

export default function ForTutorsPage() {
  const [hours, setHours] = useState(20);
  const [rate, setRate] = useState(450);
  const monthly = useMemo(() => hours * rate * 4, [hours, rate]);
  const afterFee = useMemo(() => Math.round(monthly * 0.85), [monthly]);

  return (
    <main className="bg-[var(--background)]">
      {/* Hero */}
      <section className="border-b border-[var(--border)] px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)]">
              Teach in Addis Ababa
            </p>
            <h1 className="mb-4 text-3xl font-black tracking-tight text-[var(--foreground)] md:text-5xl">
              Become a{" "}
              <span className="text-[var(--primary)]">Verified Tutor</span>
            </h1>
            <p className="mb-8 max-w-lg text-base leading-relaxed text-[var(--secondary)] md:text-lg">
              Join 12,000+ tutors on Ethiopia&apos;s trusted marketplace. Fayda-verified profiles,
              escrow payouts, and families looking for National & Cambridge teachers.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="rounded-xl bg-[var(--primary)] px-8 py-3.5 text-center text-sm font-bold text-white"
              >
                Start Application →
              </Link>
              <Link
                href="/how-it-works"
                className="rounded-xl border border-[var(--border)] px-8 py-3.5 text-center text-sm font-bold text-[var(--foreground)]"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Earnings calculator */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg md:p-8">
            <h2 className="mb-1 text-lg font-extrabold text-[var(--foreground)]">
              ETB Earnings Calculator
            </h2>
            <p className="mb-6 text-sm text-[var(--secondary)]">
              Estimate monthly income based on your rate and hours.
            </p>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
              Hours per week: {hours}h
            </label>
            <input
              type="range"
              min={5}
              max={40}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="mb-6 w-full accent-[var(--primary)]"
            />

            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
              Hourly rate: {rate} ETB
            </label>
            <input
              type="range"
              min={250}
              max={800}
              step={10}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="mb-8 w-full accent-[var(--primary)]"
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-teal-50 p-4 dark:bg-teal-950/30">
                <p className="text-[11px] font-semibold text-[var(--secondary)]">Gross / month</p>
                <p className="font-mono text-2xl font-black text-[var(--primary)]">
                  {monthly.toLocaleString()}
                </p>
                <p className="text-[11px] text-[var(--secondary)]">ETB</p>
              </div>
              <div className="rounded-xl bg-[var(--muted)] p-4">
                <p className="text-[11px] font-semibold text-[var(--secondary)]">
                  After \~15% fee
                </p>
                <p className="font-mono text-2xl font-black text-[var(--foreground)]">
                  {afterFee.toLocaleString()}
                </p>
                <p className="text-[11px] text-[var(--secondary)]">ETB take-home</p>
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-[var(--secondary)]">
              Estimates only. Actual earnings depend on bookings, Connects, and package sales.
              Payouts via Telebirr / CBE Birr.
            </p>
          </div>
        </div>
      </section>

      {/* Verification pipeline */}
      <section className="border-b border-[var(--border)] px-4 py-14 md:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)]">
              Trust Pipeline
            </p>
            <h2 className="text-2xl font-black text-[var(--foreground)] md:text-3xl">
              5-Step Fayda Verification
            </h2>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-0">
            {PIPELINE.map((step, i) => (
              <div key={step.n} className="flex flex-1 items-start lg:items-center">
                <div className="flex-1 px-2 text-center">
                  <div
                    className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl ${
                      i === 4
                        ? "border-teal-400 bg-teal-100 dark:bg-teal-900/40"
                        : "border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p className="mb-1 text-[13px] font-extrabold text-[var(--foreground)]">
                    {step.title}
                  </p>
                  <p className="text-[11px] leading-relaxed text-[var(--secondary)]">{step.desc}</p>
                </div>
                {i < PIPELINE.length - 1 && (
                  <div className="hidden h-0.5 w-8 shrink-0 bg-teal-200 dark:bg-teal-800 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-14 md:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-2xl font-black text-[var(--foreground)] md:text-3xl">
            Why tutors choose TBB
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
              >
                <div className="mb-3 text-2xl">{b.icon}</div>
                <h3 className="mb-1.5 text-base font-extrabold text-[var(--foreground)]">
                  {b.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--secondary)]">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border)] bg-gradient-to-br from-[#008779] to-[#006D61] px-4 py-14 text-center text-white dark:from-[#0D2A40] dark:to-[#0A1628] md:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 text-5xl">🔄</div>
          <h2 className="mb-3 text-2xl font-black md:text-3xl">Ready to start teaching?</h2>
          <p className="mb-8 text-sm text-white/75 md:text-base">
            Complete verification once. Build a profile parents trust. Get paid after every safe
            session.
          </p>
          <Link
            href="/register"
            className="inline-flex rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-[#008779]"
          >
            Apply as Tutor →
          </Link>
        </div>
      </section>
    </main>
  );
}