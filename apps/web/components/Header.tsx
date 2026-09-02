"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/for-parents", label: "For Parents" },
  { href: "/for-tutors", label: "For Tutors" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-[#0A1628]/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-lg text-white">
            🎓
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-teal-600">
              Tutor Be
            </p>
            <p className="-mt-1 text-base font-extrabold text-slate-900 dark:text-white">
              BETEA
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm font-semibold transition-colors ${
                pathname === n.href
                  ? "text-teal-600"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"
          >
            Get Started Free
          </Link>
        </div>

        <button
          className="text-slate-600 md:hidden dark:text-slate-300"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 px-6 py-4 md:hidden dark:border-slate-800">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              {n.label}
            </Link>
          ))}
          <div className="mt-3 flex gap-2">
            <Link href="/login" className="flex-1 rounded-xl border border-slate-200 py-2 text-center text-sm font-semibold dark:border-slate-700">
              Sign In
            </Link>
            <Link href="/register" className="flex-1 rounded-xl bg-teal-600 py-2 text-center text-sm font-bold text-white">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}