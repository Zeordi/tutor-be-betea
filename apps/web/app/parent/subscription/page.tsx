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

const PLAN_COLORS: Record<string, string> = {
  Basic: "var(--primary)",
  Premium: "#2DD4BF",
  Elite: "#7C3AED",
};

const TIER_TO_PLAN: Record<string, string> = {
  BASIC: "basic",
  PREMIUM: "premium",
  ELITE: "elite",
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
      <div className="max-w-4xl space-y-6">
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
    <div>
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-2xl font-black text-[var(--foreground)]">Your plan</h1>
        <p className="text-sm text-[var(--secondary)]">
          Currently on{" "}
          <span className="font-extrabold text-teal-400">{currentPlanName || "None"}</span>
          {sub && (
            <>
              {" "}
              ·{" "}
              <span className="font-mono font-bold text-teal-400">
                {sub.tier}
              </span>
              {" "}
              · Next billing: {sub.endsAt ? new Date(sub.endsAt).toLocaleDateString() : "N/A"}
            </>
          )}
        </p>
      </div>

      <div className="mb-6 flex justify-center gap-2">
        {(["monthly", "yearly"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCycle(c)}
            className={`rounded-full border px-4 py-1.5 text-[13px] font-bold ${
              cycle === c
                ? "border-[var(--primary)] bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40"
                : "border-[var(--border)] text-[var(--secondary)]"
            }`}
          >
            {c === "monthly" ? "Monthly" : "Yearly"}
          </button>
        ))}
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        {displayedPlans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const color = PLAN_COLORS[plan.name] || "var(--primary)";
          return (
            <div
              key={plan.id}
              className="relative rounded-2xl border-2 bg-[var(--card)] p-7"
              style={{
                borderColor: isCurrent ? color : "var(--border)",
                background: isCurrent ? `${color}12` : undefined,
              }}
            >
              {isCurrent && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[11px] font-extrabold text-white"
                  style={{ background: color }}
                >
                  CURRENT
                </span>
              )}
              <p className="text-xl font-black text-[var(--foreground)]">{plan.name}</p>
              <p className="mt-1 font-mono text-2xl font-black" style={{ color }}>
                {priceLabel(plan)}
              </p>
              <p className="mt-0.5 text-xs text-[var(--secondary)]">up to {plan.maxChildren} children</p>
              <ul className="mt-5 space-y-2.5 border-t border-[var(--border)] pt-5">
                {(plan.features || []).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-[var(--secondary)]">
                    <span style={{ color }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => upgrade(plan.id)}
                disabled={upgrading === plan.id || isCurrent}
                className="mt-6 w-full rounded-xl py-3 text-sm font-bold"
                style={{
                  background: isCurrent ? color : "var(--muted)",
                  color: isCurrent ? "#fff" : "var(--secondary)",
                  opacity: upgrading === plan.id ? 0.7 : 1,
                }}
              >
                {isCurrent ? "Current plan" : upgrading === plan.id ? "Processing…" : "Upgrade"}
              </button>
            </div>
          );
        })}
        {displayedPlans.length === 0 && (
          <div className="col-span-full text-center text-sm text-[var(--secondary)]">
            No plans available. Contact support for pricing.
          </div>
        )}
      </div>
    </div>
  );
}
