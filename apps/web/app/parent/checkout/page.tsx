"use client";

import { useState } from "react";

const STEPS = ["Package", "Schedule", "Payment", "Confirm"];
const PACKS = [
  { id: 0, label: "Single Session", price: "450 ETB", detail: "60–90 min" },
  { id: 1, label: "Starter Pack (8 hrs)", price: "2,400 ETB", detail: "Save 800 ETB" },
  { id: 2, label: "Monthly Intensive (20 hrs)", price: "4,800 ETB", detail: "Most popular" },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [pack, setPack] = useState(2);
  const [pay, setPay] = useState("telebirr");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-black text-[var(--foreground)]">Book & Pay</h1>
      <p className="mb-8 text-sm text-[var(--secondary)]">
        Escrow-protected · Telebirr · CBE Birr · M-Pesa
      </p>

      <div className="mb-8 flex gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i <= step
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted)] text-[var(--secondary)]"
              }`}
            >
              {i + 1}
            </div>
            <span className="text-[10px] font-semibold text-[var(--secondary)]">{s}</span>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-3">
          {PACKS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPack(p.id)}
              className={`w-full rounded-2xl border-[1.5px] p-4 text-left ${
                pack === p.id
                  ? "border-[var(--primary)] bg-teal-50 dark:bg-teal-950/30"
                  : "border-[var(--border)] bg-[var(--card)]"
              }`}
            >
              <p className="font-bold text-[var(--foreground)]">{p.label}</p>
              <p className="text-sm text-[var(--secondary)]">
                {p.price} · {p.detail}
              </p>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-4 w-full rounded-xl bg-[var(--primary)] py-3.5 font-bold text-white"
          >
            Continue
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="mb-4 font-bold text-[var(--foreground)]">Pick first session slot</p>
          <div className="mb-6 grid grid-cols-3 gap-2">
            {["Mon 10:00", "Wed 14:00", "Fri 09:00"].map((s) => (
              <button
                key={s}
                type="button"
                className="rounded-xl border border-[var(--border)] bg-[var(--muted)] py-3 text-sm font-semibold text-[var(--foreground)]"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="flex-1 rounded-xl border border-[var(--border)] py-3 font-bold"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 rounded-xl bg-[var(--primary)] py-3 font-bold text-white"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="mb-4 font-bold text-[var(--foreground)]">Payment method</p>
          {[
            ["telebirr", "Telebirr", "#0072CE"],
            ["cbe", "CBE Birr", "#8A1538"],
            ["mpesa", "M-Pesa", "#00A859"],
          ].map(([id, label, color]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPay(id)}
              className={`mb-2 flex w-full items-center gap-3 rounded-xl border px-4 py-3 ${
                pay === id
                  ? "border-[var(--primary)] bg-teal-50 dark:bg-teal-950/30"
                  : "border-[var(--border)]"
              }`}
            >
              <span
                className="rounded px-2 py-0.5 text-xs font-bold text-white"
                style={{ background: color }}
              >
                {label}
              </span>
              <span className="text-sm text-[var(--secondary)]">Pay with {label}</span>
            </button>
          ))}
          <p className="my-4 rounded-xl bg-teal-50 p-3 text-xs font-semibold text-[var(--primary)] dark:bg-teal-950/30">
            🔒 Funds held in escrow until sessions are confirmed
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-[var(--border)] py-3 font-bold"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 rounded-xl bg-[var(--primary)] py-3 font-bold text-white"
            >
              Pay & Hold in Escrow
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <div className="mb-3 text-5xl">✅</div>
          <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">
            Booking confirmed
          </h2>
          <p className="mb-6 text-sm text-[var(--secondary)]">
            Payment is in escrow. You will get session reminders and can track history anytime.
          </p>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}