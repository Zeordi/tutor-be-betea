"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { icon: "👤", title: "Account & Login", desc: "OTP, password, Google sign-in" },
  { icon: "🔍", title: "Finding Tutors", desc: "Filters, badges, profiles" },
  { icon: "🔒", title: "Payments & Escrow", desc: "Telebirr, CBE, M-Pesa" },
  { icon: "📅", title: "Sessions", desc: "Check-in, reports, calendar" },
  { icon: "🔄", title: "Replacement", desc: "14-day guarantee process" },
  { icon: "🛡️", title: "Trust & Safety", desc: "Verification, chat rules" },
];

const FAQS = [
  {
    q: "How does escrow work?",
    a: "You pay via Telebirr, CBE Birr, or M-Pesa. Funds stay held until the session is confirmed. If a session does not happen, you get a full refund or replacement.",
  },
  {
    q: "What is Fayda ID verification?",
    a: "Tutors submit National ID (Fayda). Admins verify credentials in a private vault. Profiles only show trust badges — never raw documents.",
  },
  {
    q: "Can I replace a tutor?",
    a: "Yes. Within the guarantee window you can request a free replacement. Escrow carries over to the new tutor automatically.",
  },
  {
    q: "Why can’t I share phone numbers in chat?",
    a: "On-platform chat blocks off-platform contact details to protect escrow coverage and keep a full safety audit trail.",
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-black text-[var(--foreground)] md:text-5xl">
            Help Center
          </h1>
          <p className="mx-auto max-w-lg text-[var(--secondary)]">
            Answers for parents and tutors. Still stuck? Open a support ticket.
          </p>
        </div>

        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
            >
              <div className="mb-3 text-2xl">{c.icon}</div>
              <p className="font-bold text-[var(--foreground)]">{c.title}</p>
              <p className="text-sm text-[var(--secondary)]">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-black text-[var(--foreground)]">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div
                key={f.q}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="pr-4 font-bold text-[var(--foreground)]">
                    {f.q}
                  </span>
                  <span className="text-[var(--primary)]">
                    {open === i ? "−" : "+"}
                  </span>
                </button>
                {open === i && (
                  <p className="border-t border-[var(--border)] px-5 py-4 text-sm leading-relaxed text-[var(--secondary)]">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-6 text-center">
            <p className="mb-3 font-bold text-[var(--foreground)]">
              Need more help?
            </p>
            <Link
              href="/contact"
              className="inline-flex rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white"
            >
              Contact support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}