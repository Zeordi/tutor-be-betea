import React from "react";

export interface ConnectsWidgetProps {
  balance: number;
  tier?: string;
  maxVisual?: number;
  onBuy?: () => void;
  className?: string;
}

/** A7 · Connects Balance Widget */
export function ConnectsWidget({
  balance,
  tier,
  maxVisual = 30,
  onBuy,
  className = "",
}: ConnectsWidgetProps) {
  const empty = balance <= 0;
  const warning = !empty && balance <= 6;
  const bg = empty
    ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
    : warning
      ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
      : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20";
  const textCls = empty
    ? "text-red-600 dark:text-red-400"
    : warning
      ? "text-amber-600 dark:text-amber-400"
      : "text-blue-600 dark:text-blue-400";
  const barCls = empty ? "bg-red-400" : warning ? "bg-amber-400" : "bg-blue-500";
  const displayTier = tier || (empty ? "Empty" : warning ? "Low" : "Standard");

  return (
    <div className={`rounded-2xl border-2 p-4 ${bg} ${className}`}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            🔗 Connects Balance
          </p>
          <p className={`mt-1 text-3xl font-extrabold ${textCls}`}>{balance}</p>
          <p className="text-[10px] text-slate-400">
            {displayTier} · ≈{Math.floor(balance / 2)} job applications
          </p>
        </div>
        {(warning || empty) && (
          <div
            className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
              empty
                ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
            }`}
          >
            {empty ? "❌ None left" : "⚠️ Low"}
          </div>
        )}
      </div>
      <div className="mb-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-full rounded-full ${barCls}`}
          style={{ width: `${Math.min(100, (balance / maxVisual) * 100)}%` }}
        />
      </div>
      {onBuy && (
        <button
          type="button"
          onClick={onBuy}
          className="w-full rounded-xl bg-teal-600 py-2 text-xs font-bold text-white"
        >
          Buy Connects
        </button>
      )}
    </div>
  );
}

export default ConnectsWidget;