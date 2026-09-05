import React from "react";

export type AppBarVariant = "back-title" | "search" | "actions" | "transparent";

export interface AppBarProps {
  variant?: AppBarVariant;
  title?: string;
  subtitle?: string;
  badge?: number;
  onBack?: () => void;
  onSearchPress?: () => void;
  searchPlaceholder?: string;
  rightActions?: React.ReactNode;
  className?: string;
}

/** A3 · Top App Bar */
export function AppBar({
  variant = "back-title",
  title = "",
  subtitle,
  badge,
  onBack,
  onSearchPress,
  searchPlaceholder = "Search tutors, subjects…",
  rightActions,
  className = "",
}: AppBarProps) {
  return (
    <div
      className={`flex h-14 items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      {(variant === "back-title" || variant === "transparent") && (
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          aria-label="Back"
        >
          ←
        </button>
      )}

      {variant === "search" ? (
        <button
          type="button"
          onClick={onSearchPress}
          className="flex flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 dark:bg-slate-700"
        >
          <span className="text-sm">🔍</span>
          <span className="text-sm text-slate-400">{searchPlaceholder}</span>
        </button>
      ) : (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-800 dark:text-white">{title}</p>
          {subtitle && <p className="text-[10px] text-emerald-500">{subtitle}</p>}
        </div>
      )}

      {variant === "actions" && (
        <div className="flex items-center gap-2">
          {rightActions ?? (
            <>
              <button
                type="button"
                className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-sm dark:bg-slate-700"
                aria-label="Notifications"
              >
                🔔
                {badge != null && badge > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-sm dark:bg-slate-700"
                aria-label="More"
              >
                ⋮
              </button>
            </>
          )}
        </div>
      )}

      {(variant === "back-title" || variant === "transparent") &&
        (rightActions ?? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-sm dark:bg-slate-700"
            >
              ❤
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-sm dark:bg-slate-700"
            >
              ⋮
            </button>
          </div>
        ))}
    </div>
  );
}

export default AppBar;