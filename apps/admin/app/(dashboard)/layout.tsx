"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, apiFetch, logout } from "@/lib/api";

type AdminRole = "super" | "verification" | "support" | "finance";

const SIDEBAR: {
  href: string;
  id: string;
  icon: string;
  label: string;
  roles: AdminRole[];
}[] = [
  { href: "/", id: "dashboard", icon: "📊", label: "Dashboard", roles: ["super", "verification", "support", "finance"] },
  { href: "/users", id: "users", icon: "👥", label: "Users", roles: ["super", "support"] },
  { href: "/verification", id: "verification", icon: "🛡️", label: "Verification Queue", roles: ["super", "verification"] },
  { href: "/vault", id: "vault", icon: "🔐", label: "Document Vault", roles: ["super", "verification"] },
  { href: "/contracts", id: "escrow", icon: "💰", label: "Escrow Monitoring", roles: ["super", "finance", "support"] },
  { href: "/attendance", id: "geofence", icon: "📍", label: "Attendance & Geo", roles: ["super", "support"] },
  { href: "/tickets", id: "tickets", icon: "🎫", label: "Support Tickets", roles: ["super", "support"] },
  { href: "/audit-logs", id: "audit", icon: "📋", label: "Audit Log", roles: ["super"] },
  { href: "/analytics", id: "analytics", icon: "📈", label: "Analytics", roles: ["super", "finance"] },
  { href: "/rbac", id: "rbac", icon: "🔑", label: "Role-Based Access", roles: ["super"] },
  { href: "/disputes", id: "disputes", icon: "⚖️", label: "Dispute Resolution", roles: ["super", "support"] },
  { href: "/risk-flags", id: "risk-flags", icon: "🚨", label: "Risk Flagging", roles: ["super", "support"] },
  { href: "/promos", id: "promos", icon: "🎟️", label: "Promo & Banners", roles: ["super", "finance"] },
  { href: "/payouts", id: "payouts", icon: "💸", label: "Payout Reconciliation", roles: ["super", "finance"] },
  { href: "/impersonation", id: "impersonation", icon: "👁️", label: "User Impersonation", roles: ["super", "support"] },
  { href: "/settings", id: "settings", icon: "⚙️", label: "System Settings", roles: ["super"] },
];

const ROLE_META: Record<AdminRole, { label: string; color: string }> = {
  super: { label: "Super", color: "#8B5CF6" },
  verification: { label: "Verification", color: "#0072CE" },
  support: { label: "Support", color: "#F59E0B" },
  finance: { label: "Finance", color: "#10B981" },
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<AdminRole>("super");
  const [user, setUser] = useState<{ fullName?: string; email?: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function validate() {
      const token = getToken();
      if (!token) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_role");
        router.replace("/login");
        return;
      }

      try {
        const data = await apiFetch<any>("/users/me");
        const apiRole = (data as any).role as string;
        const allowed = [
          "SUPER_ADMIN",
          "SUPPORT_AGENT",
          "FINANCE",
          "VERIFICATION_OFFICER",
        ];

        if (!allowed.includes(apiRole)) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_role");
          router.replace("/login");
          return;
        }

        const roleMap: Record<string, AdminRole> = {
          SUPER_ADMIN: "super",
          SUPPORT_AGENT: "support",
          FINANCE: "finance",
          VERIFICATION_OFFICER: "verification",
        };

        const mappedRole = roleMap[apiRole] || "super";

        if (!cancelled) {
          setRole(mappedRole);
          setUser({ fullName: (data as any).fullName, email: (data as any).email });
          localStorage.setItem("admin_role", mappedRole);
          setReady(true);
        }
      } catch (e) {
        if (!cancelled) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_role");
          router.replace("/login");
        }
      }
    }

    validate();

    return () => {
      cancelled = true;
    };
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

  useEffect(() => {
    if (!ready) return;
    const isAllowed = SIDEBAR.some((item) => {
      if (item.href === "/" && pathname === "/") return item.roles.includes(role);
      if (item.href !== "/" && (pathname === item.href || pathname.startsWith(`${item.href}/`))) return item.roles.includes(role);
      return false;
    });
    if (!isAllowed) {
      router.replace("/");
    }
  }, [ready, role, pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-[#060E1A]">
        <p className="text-slate-500">Loading admin…</p>
      </div>
    );
  }

  const displayName = user?.fullName || "Admin Console";
  const initials = (user?.fullName || "AU")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const navContent = (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
      {SIDEBAR.map((item) => {
        const allowed = item.roles.includes(role);
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        if (!allowed) {
          return (
            <div
              key={item.id}
              title="Locked for current role"
              className="flex w-full cursor-not-allowed items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 opacity-40 dark:text-slate-500"
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span>{item.label}</span>
              <span className="ml-auto text-[10px]">🔒</span>
            </div>
          );
        }
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
              active
                ? "bg-teal-600 font-semibold text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-800 p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-sm text-white">
            🛡️
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wide text-teal-400">
              TUTOR BE BETEA
            </p>
            <p className="text-xs font-bold text-white">
              {role === "super" ? "Super Admin" : ROLE_META[role].label}
            </p>
          </div>
        </div>
      </div>

      {navContent}

      <div className="border-t border-slate-800 p-3">
        <div className="mb-3 flex items-center gap-2.5 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-300">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-200">{displayName}</p>
            <p className="truncate text-[10px] text-slate-400">
              {user?.email || "Admin Console"}
            </p>
          </div>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ backgroundColor: ROLE_META[role].color + "33", color: ROLE_META[role].color }}
          >
            {ROLE_META[role].label}
          </span>
        </div>
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
          className="w-full rounded-xl border border-slate-700 py-2 text-xs font-semibold text-slate-400 hover:text-white"
        >
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-[#060E1A]">
      <aside className="hidden md:flex md:w-60 md:shrink-0 md:flex-col bg-slate-900 dark:bg-[#0A1628]">
        {sidebarContent}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative h-full w-64 bg-slate-900 shadow-xl dark:bg-[#0A1628]">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-11 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-[#0A1628] md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm md:hidden dark:border-slate-700 dark:bg-slate-800"
              aria-label="Open menu"
            >
              ☰
            </button>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 md:hidden">
              {displayName.split(" ")[0]}&apos;s Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Systems operational
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
