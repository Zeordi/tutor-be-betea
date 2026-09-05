import React from "react";

export type ToastTone = "success" | "info" | "warning" | "error" | "escrow";

export interface ToastProps {
  tone?: ToastTone;
  title: string;
  subtitle?: string;
  icon?: string;
  onClose?: () => void;
}

const toneMap: Record<ToastTone, string> = {
  success: "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20",
  info: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
  warning: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20",
  error: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
  escrow: "border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-900/20",
};

const defaultIcon: Record<ToastTone, string> = {
  success: "✅",
  info: "🔔",
  warning: "⚠️",
  error: "❌",
  escrow: "💰",
};

export function Toast({
  tone = "success",
  title,
  subtitle,
  icon,
  onClose,
}: ToastProps) {
  return (
    <div className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs ${toneMap[tone]}`}>
      <span className="mt-0.5 text-base">{icon ?? defaultIcon[tone]}</span>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-slate-800 dark:text-slate-100">{title}</p>
        {subtitle && <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className="text-base leading-none text-slate-400">
          ×
        </button>
      )}
    </div>
  );
}

export default Toast;