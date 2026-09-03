"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/tutors", label: "Find Tutors" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/for-tutors", label: "Become a Tutor" },
  { href: "/blog", label: "Blog" },
];

const LANGS = ["EN", "አማ", "ORO", "ትግ"];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("EN");

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:gap-8 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[var(--primary)] to-teal-300 text-lg">
            📚
          </div>
          <div className="leading-tight">
            <div className="text-base font-extrabold text-[var(--foreground)]">
              Tutor Be Betea
            </div>
            <div className="text-[10px] font-semibold text-[var(--secondary)]">
              ቱተር ቤ ቤቴ
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
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
        <div className="hidden items-center gap-2 md:flex">
          <div className="flex overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)]">
            {LANGS.map((l) => (
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

          <Link
            href="/login"
            className="rounded-[10px] border-[1.5px] border-[var(--primary)] px-4 py-2 text-[13px] font-bold text-[var(--primary)]"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="rounded-[10px] bg-[var(--primary)] px-4 py-2 text-[13px] font-bold text-white"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="ml-auto rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-bold text-[var(--foreground)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-4 md:hidden">
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
          <div className="mt-4 flex gap-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-[10px] border border-[var(--primary)] py-2.5 text-center text-sm font-bold text-[var(--primary)]"
            >
              Log In
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-[10px] bg-[var(--primary)] py-2.5 text-center text-sm font-bold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}