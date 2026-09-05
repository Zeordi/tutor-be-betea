import React from "react";

export type BannerVariant = "error" | "offline" | "info" | "update" | "warning";

export interface BannerProps {
  variant?: BannerVariant;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const variantStyles: Record<
  BannerVariant,
  { wrap: string; title: string; desc: string; icon: string }
> = {
  error: {
    wrap: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
    title: "text-red-700 dark:text-red-300",
    desc: "text-red-600 dark:text-red-400",
    icon: "❌",
  },
  offline: {
    wrap: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20",
    title: "text-amber-700 dark:text-amber-300",
    desc: "text-amber-600",
    icon: "📡",
  },
  warning: {
    wrap: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20",
    title: "text-amber-700 dark:text-amber-300",
    desc: "text-amber-600",
    icon: "⚠️",
  },
  info: {
    wrap: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
    title: "text-blue-700 dark:text-blue-300",
    desc: "text-blue-600",
    icon: "ℹ️",
  },
  update: {
    wrap: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
    title: "text-blue-700 dark:text-blue-300",
    desc: "text-blue-600",
    icon: "🔔",
  },
};

/** A10 · Error / Offline / Update banners */
export function Banner({
  variant = "info",
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: BannerProps) {
  const s = variantStyles[variant];
  return (
    <div className={`flex items-center gap-2.5 rounded-xl border p-3 ${s.wrap} ${className}`}>
      <span className="text-base">{s.icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-bold ${s.title}`}>{title}</p>
        {description && <p className={`text-[10px] ${s.desc}`}>{description}</p>}
      </div>
      {actionLabel && (
        <button type="button" onClick={onAction} className={`text-[10px] font-bold ${s.title}`}>
          {actionLabel}
        </button>
      )}
      {variant === "offline" && (
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
      )}
    </div>
  );
}

export default Banner;