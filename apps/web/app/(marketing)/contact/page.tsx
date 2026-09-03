"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="mb-3 text-4xl font-black text-[var(--foreground)] md:text-5xl">
              Contact & Support
            </h1>
            <p className="mb-8 text-[var(--secondary)]">
              Based in Addis Ababa. Team available Sunday–Friday, 8 AM–6 PM EAT.
            </p>

            <div className="mb-8 space-y-3">
              {[
                ["📍", "Office Location", "Bole Sub-city, Woreda 03, Addis Ababa"],
                ["📱", "Telegram Support", "@TutorBeBetea"],
                ["📧", "Email", "support@tutorbebetea.et"],
                ["📞", "Phone", "+251 116 123 456"],
              ].map(([icon, label, val]) => (
                <div
                  key={label}
                  className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xl dark:bg-teal-950/40">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {val}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex h-48 items-center justify-center rounded-2xl border border-[var(--border)] bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950/30 dark:to-[#0A1628]">
              <div className="text-center">
                <div className="mb-2 text-4xl">📍</div>
                <p className="font-bold text-[var(--primary)]">
                  Bole Sub-city · Addis Ababa
                </p>
                <p className="text-xs text-[var(--secondary)]">Map embed later</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
            <h2 className="mb-6 text-2xl font-black text-[var(--foreground)]">
              Send a Support Ticket
            </h2>

            {sent ? (
              <div className="rounded-xl bg-teal-50 p-6 text-center dark:bg-teal-950/30">
                <p className="font-bold text-[var(--primary)]">Ticket submitted</p>
                <p className="mt-2 text-sm text-[var(--secondary)]">
                  We will reply by email or Telegram during business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-4 text-sm font-bold text-[var(--primary)]"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                {[
                  ["Your Name", "text", "Hana Mulugeta"],
                  ["Email Address", "email", "hana@example.com"],
                  ["Phone (Optional)", "tel", "+251 9X XXX XXXX"],
                ].map(([label, type, ph]) => (
                  <div key={label}>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={ph}
                      required={type !== "tel"}
                      className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--muted)] px-3.5 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
                    Issue Category
                  </label>
                  <select className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--muted)] px-3.5 py-3 text-sm text-[var(--foreground)] outline-none">
                    {[
                      "Select category...",
                      "Payment Issue",
                      "Tutor Behaviour",
                      "Technical Problem",
                      "Account Issue",
                      "Other",
                    ].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your issue in detail..."
                    className="w-full resize-y rounded-[10px] border border-[var(--border)] bg-[var(--muted)] px-3.5 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[var(--primary)] py-3.5 text-[15px] font-bold text-white"
                >
                  Submit Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}