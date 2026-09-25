"use client";

import { useState } from "react";
import { useTheme } from "@tutor/ui";

const LANGS = ["EN", "አማ"] as const;

export function MobileAuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { mode, toggleTheme } = useTheme();
  const [lang, setLang] = useState<(typeof LANGS)[number]>("EN");

  return (
    <div className="md:hidden mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[var(--primary)] to-teal-300 text-lg">
            🎓
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
              TUTOR BE BETEA
            </p>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              ቱቶር በ ቤቴ
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] text-sm"
            aria-label="Toggle theme"
          >
            {mode === "dark" ? "☀️" : "🌙"}
          </button>
          <div className="flex overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)]">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-2 py-1 text-[11px] font-bold transition ${
                  lang === l
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--secondary)]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
      {title && (
        <div className="mt-5">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
