"use client";

import { useEffect, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

type BillingCycle = "monthly" | "yearly";

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: string;
  maxChildren: number;
  features: string[];
};

type Subscription = {
  id: string;
  status: "ACTIVE" | "CANCELLED" | "PAST_DUE" | "EXPIRED";
  tier: "BASIC" | "PREMIUM" | "ELITE";
  startsAt: string;
  endsAt: string | null;
};

const TIER_TO_PLAN: Record<string, string> = {
  BASIC: "basic",
  PREMIUM: "premium",
  ELITE: "elite",
};

const PLAN_STYLES: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  Basic: {
    border: "border-teal-500",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    text: "text-teal-700 dark:text-teal-300",
    badge: "bg-teal-600",
  },
  Premium: {
    border: "border-teal-500",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    text: "text-teal-700 dark:text-teal-300",
    badge: "bg-teal-600",
  },
  Elite: {
    border: "border-purple-500",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-700 dark:text-purple-300",
    badge: "bg-purple-600",
  },
};

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sub, setSub] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const currentPlanId = sub ? TIER_TO_PLAN[sub.tier] || "" : "";

  const upgrade = async (planId: string) => {
    setUpgrading(planId);
    try {
      const tierMap: Record<string, "BASIC" | "PREMIUM" | "ELITE"> = {
        basic: "BASIC",
        premium: "PREMIUM",
        elite: "ELITE",
      };
      const tier = tierMap[planId];
      if (!tier) throw new Error("Invalid plan");
      await apiFetch<any>(paths.subscriptionUpgrade, {
        method: "POST",
        body: JSON.stringify({ tier }),
      });
      const refreshed = await apiFetch<Subscription>(paths.subscriptionMine);
      setSub(refreshed);
    } catch (err: any) {
      setError(err.message || "Failed to upgrade");
    } finally {
      setUpgrading(null);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([
      apiFetch<Subscription>(paths.subscriptionMine),
      apiFetch<SubscriptionPlan[]>(paths.subscriptionPlans),
    ])
      .then(([s, p]) => {
        if (!cancelled) {
          setSub(s);
          setPlans(p || []);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load subscription");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[320px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const displayedPlans: SubscriptionPlan[] = [...plans].sort((a, b) => {
    if (a.name === "Basic") return -1;
    if (b.name === "Basic") return 1;
    if (a.name === "Elite") return 1;
    if (b.name === "Elite") return -1;
    return 0;
  });

  const priceLabel = (plan: SubscriptionPlan) => {
    const monthly = plan.price;
    if (cycle === "yearly") {
      const yearly = plan.price * 12;
      return `${yearly.toLocaleString()} ETB/yr`;
    }
    return `${monthly.toLocaleString()} ETB/mo`;
  };

  const currentPlanName = sub
    ? displayedPlans.find((p) => p.id === currentPlanId)?.name || sub.tier
    : "";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-black text-slate-800 dark:text-white">Your plan</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Currently on{" "}
          <span className="font-extrabold text-teal-600">{currentPlanName || "None"}</span>
          {sub && (
            <>
              {" "}
              ·{" "}
              <span className="font-mono font-bold text-teal-600">
                {sub.tier}
              </span>
              {" "}
              · Next billing: {sub.endsAt ? new Date(sub.endsAt).toLocaleDateString() : "N/A"}
            </>
          )}
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {(["monthly", "yearly"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCycle(c)}
            className={`rounded-full border px-4 py-1.5 text-[13px] font-bold ${
              cycle === c
                ? "border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                : "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400"
            }`}
          >
            {c === "monthly" ? "Monthly" : "Yearly"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {displayedPlans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const style = PLAN_STYLES[plan.name] || PLAN_STYLES.Basic;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 bg-white p-7 dark:bg-[#112240] ${
                isCurrent ? style.border : "border-slate-200 dark:border-slate-800"
              } ${isCurrent ? style.bg : ""}`}
            >
              {isCurrent && (
                <span
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[11px] font-extrabold text-white ${style.badge}`}
                >
                  CURRENT PLAN
                </span>
              )}
              <p className="text-xl font-black text-slate-800 dark:text-white">{plan.name}</p>
              <p className={`mt-1 font-mono text-2xl font-black ${style.text}`}>
                {priceLabel(plan)}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">up to {plan.maxChildren} children</p>
              <ul className="mt-5 space-y-2.5 border-t border-slate-200 pt-5 dark:border-slate-800">
                {(plan.features || []).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-slate-600 dark:text-slate-400">
                    <span className={style.text}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => upgrade(plan.id)}
                disabled={upgrading === plan.id || isCurrent}
                className={`mt-6 w-full rounded-xl py-3 text-sm font-bold ${
                  isCurrent
                    ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                } ${upgrading === plan.id ? "opacity-70" : ""}`}
              >
                {isCurrent ? "Current plan" : upgrading === plan.id ? "Processing…" : "Upgrade"}
              </button>
            </div>
          );
        })}
        {displayedPlans.length === 0 && (
          <div className="col-span-full text-center text-sm text-slate-500 dark:text-slate-400">
            No plans available. Contact support for pricing.
          </div>
        )}
      </div>
    </div>
  );
}
