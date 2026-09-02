"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SECTIONS = [
  { href: "/teacher", label: "Dashboard", icon: "🏠" },
  { href: "/teacher/jobs", label: "Available Jobs", icon: "🔍" },
  { href: "/teacher/contracts", label: "Active Contracts", icon: "📄" },
  { href: "/teacher/sessions", label: "Sessions", icon: "📅" },
  { href: "/teacher/earnings", label: "Earnings", icon: "💰" },
  { href: "/teacher/profile", label: "My Profile", icon: "👤" },
  { href: "/teacher/chat", label: "Messages", icon: "💬" },
  { href: "/teacher/verification", label: "Verification", icon: "🛡️" },
  { href: "/teacher/progress", label: "Progress", icon: "📊" },
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#0A1628]">
        <p className="text-slate-500">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0A1628]">
      <aside className="hidden w-56 flex-shrink-0 overflow-y-auto border-r border-slate-100 bg-white dark:border-slate-800 dark:bg-[#112240] md:block">
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
              ST
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                Tutor Account
              </p>
              <span className="text-[10px] font-semibold text-teal-600">
                🔗 24 Connects
              </span>
            </div>
          </div>
        </div>
        <nav className="space-y-0.5 p-2">
          {SECTIONS.map((s) => {
            const active =
              pathname === s.href ||
              (s.href !== "/teacher" && pathname.startsWith(s.href));
            return (
              <Link
                key={s.href}
                href={s.href}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-all ${
                  active
                    ? "bg-teal-50 font-semibold text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-500 dark:border-slate-700"
          >
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}