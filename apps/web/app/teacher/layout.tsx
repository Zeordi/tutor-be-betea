"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SECTIONS = [
  { href: "/teacher", label: "Overview", icon: "🏠", exact: true },
  { href: "/teacher/jobs", label: "Job Board", icon: "⚡" },
  { href: "/teacher/applications", label: "My Applications", icon: "📋" },
  { href: "/teacher/contracts", label: "Active Contracts", icon: "📝" },
  { href: "/teacher/availability", label: "Availability", icon: "⏰" },
  { href: "/teacher/calendar", label: "My Calendar", icon: "📅" },
  { href: "/teacher/chat", label: "Messages", icon: "💬" },
  { href: "/teacher/verification", label: "Documents", icon: "🪪" },
  { href: "/teacher/earnings", label: "Earnings", icon: "💰" },
  { href: "/teacher/progress/submit", label: "Progress Submit", icon: "📊" },
  { href: "/teacher/sessions", label: "Sessions", icon: "🕐" },
  { href: "/teacher/profile", label: "Profile", icon: "👤" },
  { href: "/teacher/analytics", label: "Analytics", icon: "📈" },
  { href: "/teacher/notifications", label: "Notifications", icon: "🔔" },
  { href: "/teacher/onboarding", label: "Onboarding", icon: "🚀" },
  { href: "/teacher/risk-flag", label: "Risk Flag", icon: "⚑" },
  { href: "/teacher/settings", label: "Settings", icon: "⚙️" },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

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

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <aside className="flex w-60 shrink-0 flex-col bg-[var(--primary)] text-white dark:bg-[#0A1628]">
        <div className="border-b border-white/10 px-5 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/15 text-lg">
              📚
            </div>
            <div>
              <p className="text-[15px] font-extrabold">Tutor Be Betea</p>
              <p className="text-[11px] font-semibold text-white/50">Teacher Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {SECTIONS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold transition ${
                isActive(item.href, item.exact)
                  ? "bg-white/15 text-white"
                  : "text-white/55 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 px-5 py-4">
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-amber-500/20 px-3 py-2">
            <span>⚡</span>
            <span className="font-mono text-sm font-bold text-amber-300">14</span>
            <span className="text-[11px] text-white/60">Connects</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
              👨‍🏫
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold">Berhane Alemu</p>
              <p className="truncate text-[11px] text-white/50">berhane@tutor.et</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-5 md:h-16 md:px-8">
          <p className="font-extrabold text-[var(--foreground)]">Teacher Portal</p>
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
            ⚡ 14 Connects
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}