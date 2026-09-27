"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch, paths, logout, clearToken } from "@/lib/api";
import { useTheme } from "@tutor/ui";

type CurrentUser = {
  fullName: string;
  phoneNumber: string;
  email: string | null;
  role: string;
};

type Subscription = {
  tier: "BASIC" | "PREMIUM" | "ELITE";
  status: string;
};

const SECTIONS = [
  { href: "/parent", label: "Overview", icon: "🏠", exact: true },
  { href: "/parent/tutors", label: "Find Tutors", icon: "🔍" },
  { href: "/parent/jobs/create", label: "Post a Job", icon: "📝" },
  { href: "/parent/jobs", label: "My Jobs", icon: "💼" },
  { href: "/parent/contracts", label: "Contracts", icon: "📄" },
  { href: "/parent/progress", label: "Progress", icon: "📊" },
  { href: "/parent/children", label: "My Children", icon: "👨‍👩‍👧" },
  { href: "/parent/chat", label: "Messages", icon: "💬" },
  { href: "/parent/favorites", label: "Favourites", icon: "❤️" },
  { href: "/parent/calendar", label: "Calendar", icon: "📅" },
  { href: "/parent/history", label: "Session History", icon: "📋" },
  { href: "/parent/wallet", label: "Wallet", icon: "💰" },
  { href: "/parent/subscription", label: "Subscription", icon: "⭐" },
  { href: "/parent/safety", label: "Safety", icon: "🛡️" },
  { href: "/parent/notifications", label: "Notifications", icon: "🔔" },
  { href: "/parent/settings", label: "Settings", icon: "⚙️" },
];

const PLAN_COPY: Record<string, string> = {
  ELITE: "Elite Plan",
  PREMIUM: "Premium Plan",
  BASIC: "Basic Plan",
};

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mode, toggleTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    setProfileLoading(true);
    apiFetch<CurrentUser>(paths.usersMe)
      .then((data) => {
        if (!cancelled) {
          if (data.role !== "PARENT") {
            clearToken();
            router.replace("/login");
            return;
          }
          setUser(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem("token");
          router.replace("/login");
        }
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ready, router]);

  useEffect(() => {
    if (!ready || !user) return;
    let cancelled = false;
    apiFetch<Subscription | null>(paths.subscriptionMine)
      .then((data) => {
        if (!cancelled) setSubscription(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [ready, user]);

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
    if (href === "/parent/jobs") {
      return pathname === "/parent/jobs" || pathname.startsWith("/parent/jobs/");
    }
    if (href === "/parent/jobs/create") {
      return pathname === "/parent/jobs/create";
    }
    if (href === "/parent/chat") {
      return pathname === "/parent/chat" || pathname.startsWith("/parent/chat/");
    }
    if (href === "/parent/history") {
      return (
        pathname === "/parent/history" ||
        pathname.startsWith("/parent/history/")
      );
    }
    if (href === "/parent/tutors") {
      return (
        pathname === "/parent/tutors" ||
        pathname.startsWith("/parent/tutors/")
      );
    }
    if (href === "/parent/children") {
      return (
        pathname === "/parent/children" ||
        pathname.startsWith("/parent/children/")
      );
    }
    if (href === "/parent/favorites") {
      return (
        pathname === "/parent/favorites" ||
        pathname.startsWith("/parent/favorites/")
      );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const displayName = user?.fullName || "Loading…";
  const firstName = displayName.split(" ")[0] || "there";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const planLabel = subscription ? PLAN_COPY[subscription.tier] || subscription.tier : "Parent";
  const isElite = subscription?.tier === "ELITE";

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-teal-600 text-lg text-white">
            📚
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-slate-900 dark:text-white">Tutor Be Betea</p>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Parent Dashboard</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            {initials || "P"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-slate-900 dark:text-white">{displayName}</p>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              {profileLoading ? "Loading…" : (user?.phoneNumber || user?.email || "Parent")}
            </p>
          </div>
        </div>
        {planLabel && (
          <div className="mt-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                isElite
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {planLabel}
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {SECTIONS.map((item) => (
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
      </nav>

      <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-700/60">
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
          className="w-full rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          Log out
        </button>
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
            <div className="hidden items-center gap-0.5 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)] sm:flex">
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
            <Link
              href="/parent/notifications"
              className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] text-sm"
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
