"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@tutor/ui";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/for-parents", label: "For Parents" },
  { href: "/for-tutors", label: "For Tutors" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
];

const LANGS = ["EN", "አማ"];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("EN");
  const { mode, toggleTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-700 dark:bg-[#0A1628]/95 dark:supports-[backdrop-filter]:bg-[#0A1628]/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:gap-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[var(--primary)] to-teal-300 text-lg">
            🎓
          </div>
          <div className="leading-tight">
            <div className="text-base font-extrabold text-[var(--foreground)]">
              TUTOR BE BETEA
            </div>
            <div className="text-[10px] font-semibold text-[var(--secondary)]">
              ቱቶር በ ቤቴ
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-2.5 py-2 text-[13px] font-semibold transition ${
                isActive(item.href)
                  ? "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40"
                  : "text-[var(--secondary)] hover:text-[var(--foreground)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-1.5 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)] text-sm"
            aria-label="Toggle theme"
          >
            {mode === "dark" ? "☀️" : "🌙"}
          </button>

          <div className="flex overflow-hidden rounded-md border border-[var(--border)] bg-[var(--muted)]">
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

          <Link
            href="/login"
            className="rounded-[10px] border border-[var(--primary)] px-3 py-1.5 text-[13px] font-bold text-[var(--primary)]"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-[10px] bg-[var(--primary)] px-3 py-1.5 text-[13px] font-bold text-white"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)] text-sm"
            aria-label="Toggle theme"
          >
            {mode === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            type="button"
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-bold text-[var(--foreground)]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-4 md:hidden">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    isActive(item.href)
                      ? "bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40"
                      : "text-[var(--secondary)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex overflow-hidden rounded-md border border-[var(--border)] bg-[var(--muted)]">
                {LANGS.map((l, i) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    className={`px-2.5 py-1.5 text-[11px] font-bold transition ${
                      lang === l
                        ? "bg-[var(--primary)] text-white"
                        : "text-[var(--secondary)]"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-[10px] border border-[var(--primary)] py-2.5 text-center text-sm font-bold text-[var(--primary)]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-[10px] bg-[var(--primary)] py-2.5 text-center text-sm font-bold text-white"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}