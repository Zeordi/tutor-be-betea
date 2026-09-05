import React from "react";

export type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "gold"
  | "elite"
  | "verified"
  | "urgent"
  | "boost";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: "sm" | "md";
  icon?: string;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  error: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  info: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  gold: "border border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  elite: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
  verified: "bg-teal-600 text-white",
  urgent: "bg-red-600 text-white",
  boost: "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
};

export function Badge({
  variant = "primary",
  children,
  size = "md",
  icon,
  className = "",
}: BadgeProps) {
  const sizeClass = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClass} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}

export default Badge;