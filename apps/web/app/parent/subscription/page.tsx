"use client";

const PLANS = [
  {
    name: "Basic",
    price: "500 ETB/mo",
    features: ["Up to 2 children", "Search & book tutors", "Session history", "Basic AI reports", "Telebirr payments"],
    color: "var(--primary)",
    current: false,
  },
  {
    name: "Premium",
    price: "1,800 ETB/mo",
    features: ["Up to 4 children", "Priority matching", "Full AI reports", "Family calendar", "Multi-payment", "Dedicated support"],
    color: "#2DD4BF",
    current: true,
  },
  {
    name: "Elite",
    price: "4,200 ETB/mo",
    features: ["Unlimited children", "VIP tutors", "Realtime dashboard", "School integration", "Custom curriculum", "Monthly coaching call"],
    color: "#7C3AED",
    current: false,
  },
];

export default function SubscriptionPage() {
  return (
    <div>
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-2xl font-black text-[var(--foreground)]">Your plan</h1>
        <p className="text-sm text-[var(--secondary)]">
          Currently on <span className="font-extrabold text-teal-400">Premium</span> ·{" "}
          <span className="font-mono font-bold text-teal-400">1,800 ETB/mo</span>
        </p>
      </div>
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className="relative rounded-2xl border-2 bg-[var(--card)] p-7"
            style={{
              borderColor: plan.current ? plan.color : "var(--border)",
              background: plan.current ? `${plan.color}12` : undefined,
            }}
          >
            {plan.current && (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[11px] font-extrabold text-white"
                style={{ background: plan.color }}
              >
                CURRENT
              </span>
            )}
            <p className="text-xl font-black text-[var(--foreground)]">{plan.name}</p>
            <p
              className="mt-1 font-mono text-2xl font-black"
              style={{ color: plan.color }}
            >
              {plan.price}
            </p>
            <ul className="mt-5 space-y-2.5 border-t border-[var(--border)] pt-5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-[var(--secondary)]">
                  <span style={{ color: plan.color }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-6 w-full rounded-xl py-3 text-sm font-bold"
              style={{
                background: plan.current ? plan.color : "var(--muted)",
                color: plan.current ? "#fff" : "var(--secondary)",
              }}
            >
              {plan.current ? "Current plan" : plan.name === "Elite" ? "Upgrade to Elite" : "Select"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}