"use client";

import { useState } from "react";
import Link from "next/link";

const PLANS = [
  {
    name: "Basic",
    monthly: 500,
    annual: 400,
    desc: "Perfect for a single child",
    features: [
      "3 sessions/month",
      "Standard matching",
      "Basic progress reports",
      "2 Connects/month",
      "Phone & chat support",
    ],
    popular: false,
  },
  {
    name: "Premium",
    monthly: 1800,
    annual: 1440,
    desc: "Most popular for families",
    features: [
      "10 sessions/month",
      "AI-powered matching",
      "Full progress reports",
      "10 Connects/month",
      "Multi-child (up to 3)",
      "Priority support",
      "Replacement guarantee",
    ],
    popular: true,
  },
  {
    name: "Elite",
    monthly: 4200,
    annual: 3360,
    desc: "Unlimited for ambitious families",
    features: [
      "Unlimited sessions",
      "Priority AI matching",
      "AI summary + coaching",
      "30 Connects/month",
      "Unlimited children",
      "24/7 emergency support",
      "Replacement guarantee",
      "Dedicated family manager",
    ],
    popular: false,
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const annual = billing === "annual";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1628]">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-extrabold text-slate-900 dark:text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="mb-6 text-slate-500 dark:text-slate-400">
            All plans include trust badges, safety tools, and local payment support
          </p>
          <div className="inline-flex rounded-xl bg-slate-200 p-1 dark:bg-slate-800">
            {(["monthly", "annual"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                  billing === b
                    ? "bg-white text-teal-600 shadow-sm dark:bg-slate-700"
                    : "text-slate-500"
                }`}
              >
                {b === "annual" ? "📅 Annual (Save 20%)" : "📆 Monthly"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const price = annual ? plan.annual : plan.monthly;
            return (
              <div
                key={plan.name}
                className={`relative rounded-3xl border-2 bg-white p-8 shadow-sm dark:bg-slate-800/80 ${
                  plan.popular
                    ? "border-teal-500"
                    : "border-slate-100 dark:border-slate-700/60"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-teal-600 px-4 py-1 text-xs font-bold text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                <p className="mb-1 text-xl font-extrabold text-slate-900 dark:text-white">
                  {plan.name}
                </p>
                <p className="mb-4 text-xs text-slate-500">{plan.desc}</p>
                <p className="mb-1 text-4xl font-extrabold text-teal-600">
                  {price.toLocaleString()}
                  <span className="text-base font-normal text-slate-400">
                    {" "}
                    ETB/mo
                  </span>
                </p>
                {annual && (
                  <p className="mb-4 text-xs font-semibold text-emerald-600">
                    Save 20% with annual billing
                  </p>
                )}
                <div className="mb-6 mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <div
                      key={f}
                      className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                    >
                      <span className="mt-0.5 shrink-0 text-teal-500">✓</span>
                      {f}
                    </div>
                  ))}
                </div>
                <Link
                  href="/register"
                  className={`block w-full rounded-xl py-3 text-center text-sm font-bold ${
                    plan.popular
                      ? "bg-teal-600 text-white hover:bg-teal-700"
                      : "border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                  }`}
                >
                  {plan.popular ? "Get Started" : `Choose ${plan.name}`}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
            💳 Pay via Telebirr · CBE Birr · Bank Transfer · Visa
          </p>
          <p className="text-xs text-slate-400">
            All plans include 30-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}