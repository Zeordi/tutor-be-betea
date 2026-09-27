"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch, paths, clearToken } from "@/lib/api";
import { useTheme } from "@tutor/ui";

type TeacherMe = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  teacherProfile: {
    connectsBalance: number;
    rating?: number;
    reviewCount?: number;
    isVerified?: boolean;
    idVerified?: boolean;
    degreeVerified?: boolean;
  } | null;
};

const PRIMARY_SECTIONS = [
  { href: "/teacher", label: "Dashboard", icon: "🏠", exact: true },
  { href: "/teacher/jobs", label: "Available Jobs", icon: "💼" },
  { href: "/teacher/applications", label: "My Applications", icon: "📋" },
  { href: "/teacher/contracts", label: "Active Contracts", icon: "📝" },
  { href: "/teacher/sessions", label: "Sessions", icon: "🕐" },
  { href: "/teacher/earnings", label: "Earnings", icon: "💰" },
  { href: "/teacher/profile", label: "My Profile", icon: "👤" },
  { href: "/teacher/availability", label: "Availability", icon: "⏰" },
  { href: "/teacher/calendar", label: "Calendar", icon: "📅" },
  { href: "/teacher/chat", label: "Messages", icon: "💬" },
  { href: "/teacher/analytics", label: "Analytics", icon: "📈" },
  { href: "/teacher/verification", label: "Verification", icon: "🪪" },
  { href: "/teacher/settings", label: "Connects & Settings", icon: "⚙️" },
];

const SECONDARY_SECTIONS = [
  { href: "/teacher/onboarding", label: "Onboarding", icon: "🚀" },
  { href: "/teacher/risk-flag", label: "Risk Flag", icon: "⚑" },
  { href: "/teacher/progress/submit", label: "Progress Submit", icon: "📊" },
  { href: "/teacher/notifications", label: "Notifications", icon: "🔔" },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [me, setMe] = useState<TeacherMe | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mode, toggleTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    apiFetch<TeacherMe>(paths.usersMe)
      .then((data) => {
        if ((data as any).role !== "TEACHER") {
          clearToken();
          router.replace("/login");
          return;
        }
        setMe(data);
      })
      .catch(() => {
        clearToken();
        router.replace("/login");
      })
      .finally(() => setReady(true));
  }, [router]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [sidebarOpen]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--secondary)]">Checking authentication…</p>
      </main>
    );
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const displayName = me?.fullName || "Teacher";
  const firstName = displayName.split(" ")[0] || "there";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const connects = me?.teacherProfile?.connectsBalance ?? 0;

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-teal-600 text-lg text-white">
            📚
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-slate-900 dark:text-white">Tutor Be Betea</p>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Teacher Dashboard</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            {initials || "T"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-slate-900 dark:text-white">{displayName}</p>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              {me?.email || "teacher@tutor.et"}
            </p>
          </div>
        </div>
        <div className="mt-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
            ⚡ {connects} Connects
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {PRIMARY_SECTIONS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition ${
              isActive(item.href, item.exact)
                ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span className="text-base leading-none">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div className="my-3 border-t border-slate-200 dark:border-slate-700/60" />

        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          More
        </p>
        {SECONDARY_SECTIONS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition ${
              isActive(item.href)
                ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span className="text-base leading-none">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-700/60">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] text-sm"
            aria-label="Toggle theme"
          >
            {mode === "dark" ? "☀️" : "🌙"}
          </button>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Tutor Be Betea</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <aside className="hidden md:flex md:w-56 md:shrink-0 md:flex-col bg-white dark:bg-[#112240]">
        {sidebarContent}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative h-full w-64 bg-white shadow-xl dark:bg-[#112240]">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] text-sm md:hidden"
              aria-label="Open menu"
            >
              ☰
            </button>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 md:hidden">
              {firstName}&apos;s Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)] sm:flex">
              {["EN", "አማ"].map((l, i) => (
                <span
                  key={l}
                  className={`px-2 py-1 text-[10px] font-bold ${
                    i === 0
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--secondary)]"
                  }`}
                >
                  {l}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300">
              <span>⚡</span>
              <span>{connects}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
