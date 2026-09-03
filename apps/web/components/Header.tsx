"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
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

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:gap-8 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[var(--primary)] to-teal-300 text-lg">
            📚
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-extrabold text-[var(--foreground)]">
              Tutor Be Betea
            </div>
            <div className="text-[10px] font-semibold text-[var(--secondary)]">
              ቱተር ቤ ቤቴ
            </div>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "text-[var(--secondary)] hover:text-[var(--foreground)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] sm:flex">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-2.5 py-1.5 text-[11px] font-bold transition ${
                  lang === l
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--secondary)] hover:bg-[var(--muted)]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <Link
            href="/login"
            className="hidden rounded-[10px] border-[1.5px] border-[var(--primary)] px-4 py-2 text-[13px] font-bold text-[var(--primary)] sm:inline-flex"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="rounded-[10px] bg-[var(--primary)] px-4 py-2 text-[13px] font-bold text-white"
          >
            Get Started
          </Link>

          <button
            type="button"
            className="rounded-lg border border-[var(--border)] p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className="text-[var(--foreground)]">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-3 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--foreground)]"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2">
            <Link
              href="/login"
              className="flex-1 rounded-lg border border-[var(--primary)] py-2 text-center text-sm font-bold text-[var(--primary)]"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="flex-1 rounded-lg bg-[var(--primary)] py-2 text-center text-sm font-bold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}