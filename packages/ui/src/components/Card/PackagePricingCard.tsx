import React from "react";
import { TrustBadges } from "../TrustBadges";
import { Avatar } from "../Avatar";

export interface PackagePricingCardProps {
  plan: string;
  price: number;
  sessions: number;
  perSession: number;
  features: string[];
  tutorName: string;
  tutorLocation?: string;
  popular?: boolean;
  currency?: string;
  onSelect?: () => void;
  className?: string;
}

/** A4 · Package Pricing Cards */
export function PackagePricingCard({
  plan,
  price,
  sessions,
  perSession,
  features,
  tutorName,
  tutorLocation = "Bole",
  popular,
  currency = "ETB",
  onSelect,
  className = "",
}: PackagePricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border-2 bg-white p-5 shadow-sm dark:bg-slate-800 ${
        popular
          ? "border-teal-500 shadow-lg shadow-teal-100 dark:shadow-teal-900/30"
          : "border-slate-200 dark:border-slate-700"
      } ${className}`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 px-3 py-1 text-[10px] font-extrabold text-white">
          ⭐ Most Popular
        </div>
      )}
      <div className="mb-4">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">{plan}</p>
        <div className="flex items-end gap-1">
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {price.toLocaleString()}
          </p>
          <p className="mb-0.5 text-sm text-slate-400">{currency}</p>
        </div>
        <p className="text-xs text-slate-500">
          {sessions} sessions · {perSession} {currency} each
        </p>
      </div>
      <div className="mb-4 flex-1 space-y-2">
        {features.map((f) => (
          <div key={f} className="flex items-start gap-2">
            <span className="mt-0.5 text-xs text-teal-500">✓</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">{f}</span>
          </div>
        ))}
      </div>
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800/80">
        <Avatar name={tutorName} size="xs" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-bold text-slate-700 dark:text-slate-300">
            {tutorName}
          </p>
          <p className="text-[9px] text-slate-400">Verified Tutor · {tutorLocation}</p>
        </div>
        <TrustBadges nationalId degreeVerified compact />
      </div>
      <button
        type="button"
        onClick={onSelect}
        className={`w-full rounded-xl py-2.5 text-sm font-bold ${
          popular
            ? "bg-teal-600 text-white"
            : "border-2 border-teal-600 text-teal-700 dark:border-teal-500 dark:text-teal-300"
        }`}
      >
        {popular ? "🚀 Book This Package" : "Select Package"}
      </button>
    </div>
  );
}

export default PackagePricingCard;