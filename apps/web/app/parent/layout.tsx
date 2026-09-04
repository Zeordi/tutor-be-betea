"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SECTIONS = [
  // Core (already in your app)
  { href: "/parent", label: "Overview", icon: "🏠", exact: true },
  { href: "/parent/tutors", label: "Find Tutors", icon: "🔍" },
  { href: "/parent/jobs/create", label: "Post a Job", icon: "📝" },
  { href: "/parent/jobs", label: "My Jobs", icon: "💼" },
  { href: "/parent/contracts", label: "Contracts", icon: "📄" },
  { href: "/parent/progress", label: "Progress", icon: "📊" },
  { href: "/parent/children", label: "My Children", icon: "👨‍👩‍👧" },
  { href: "/parent/chat", label: "Messages", icon: "💬" },
  { href: "/parent/wallet", label: "Wallet", icon: "💰" },
  { href: "/parent/sessions", label: "Sessions", icon: "🕐" },
  { href: "/parent/notifications", label: "Notifications", icon: "🔔" },
  // Figma ParentDash (new / extended)
  { href: "/parent/favorites", label: "Saved Tutors", icon: "❤️" },
  { href: "/parent/calendar", label: "Family Calendar", icon: "📅" },
  { href: "/parent/checkout", label: "Book & Pay", icon: "💳" },
  { href: "/parent/history", label: "Session History", icon: "📋" },
  { href: "/parent/safety", label: "Safety Center", icon: "🛡️" },
  { href: "/parent/subscription", label: "My Plan", icon: "⭐" },
  // Account
  { href: "/parent/settings", label: "Settings", icon: "⚙️" },
];

export default function ParentLayout({
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
    if (href === "/parent/jobs") {
      return pathname === "/parent/jobs" || pathname.startsWith("/parent/jobs/");
    }
    if (href === "/parent/jobs/create") {
      return pathname === "/parent/jobs/create";
    }
    if (href === "/parent/chat") {
      return pathname === "/parent/chat" || pathname.startsWith("/parent/chat/");
    }
    if (href === "/parent/sessions") {
      return (
        pathname === "/parent/sessions" ||
        pathname.startsWith("/parent/sessions/")
      );
    }
    if (href === "/parent/tutors") {
      return (
        pathname === "/parent/tutors" || pathname.startsWith("/parent/tutors/")
      );
    }
    if (href === "/parent/children") {
      return (
        pathname === "/parent/children" ||
        pathname.startsWith("/parent/children/")
      );
    }
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
              <p className="text-[11px] font-semibold text-white/50">
                Parent Dashboard
              </p>
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
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
              👩🏾
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold">Hana Mulugeta</p>
              <p className="truncate text-[11px] text-white/50">hana@email.com</p>
            </div>
            <Link
              href="/parent/settings"
              className="text-white/50 transition hover:text-white"
              aria-label="Settings"
            >
              ⚙
            </Link>
          </div>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="mt-3 w-full rounded-lg border border-white/15 py-2 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white"
          >
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-5 md:h-16 md:px-8">
          <p className="text-base font-extrabold text-[var(--foreground)] md:text-lg">
            Parent Dashboard
          </p>
          <div className="flex items-center gap-3">
            <div className="hidden overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)] sm:flex">
              {["EN", "አማ", "ORO", "ትግ"].map((l, i) => (
                <span
                  key={l}
                  className={`px-2.5 py-1 text-[10px] font-bold ${
                    i === 0
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--secondary)]"
                  }`}
                >
                  {l}
                </span>
              ))}
            </div>
            <Link
              href="/parent/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--muted)] text-sm"
              aria-label="Notifications"
            >
              🔔
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}