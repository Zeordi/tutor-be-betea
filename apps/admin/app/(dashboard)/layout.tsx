"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SIDEBAR = [
  // Core (already in repo)
  { href: "/", id: "dashboard", icon: "📊", label: "Dashboard" },
  { href: "/users", id: "users", icon: "👥", label: "Users" },
  { href: "/verification", id: "verification", icon: "🛡️", label: "Verification Queue" },
  { href: "/vault", id: "vault", icon: "🔐", label: "Document Vault" },
  { href: "/contracts", id: "escrow", icon: "💰", label: "Escrow Monitoring" },
  { href: "/attendance", id: "geofence", icon: "📍", label: "Attendance & Geo" },
  { href: "/tickets", id: "tickets", icon: "🎫", label: "Support Tickets" },
  { href: "/audit-logs", id: "audit", icon: "📋", label: "Audit Log" },
  { href: "/analytics", id: "analytics", icon: "📈", label: "Analytics" },
  // Figma Admin Console (new)
  { href: "/rbac", id: "rbac", icon: "🔑", label: "Role-Based Access" },
  { href: "/disputes", id: "disputes", icon: "⚖️", label: "Dispute Resolution" },
  { href: "/risk-flags", id: "risk-flags", icon: "🚨", label: "Risk Flagging" },
  { href: "/promos", id: "promos", icon: "🎟️", label: "Promo & Banners" },
  { href: "/payouts", id: "payouts", icon: "💸", label: "Payout Reconciliation" },
  { href: "/impersonation", id: "impersonation", icon: "👁️", label: "User Impersonation" },
  // Account
  { href: "/settings", id: "settings", icon: "⚙️", label: "System Settings" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    // Soft gate for local preview — enable when auth is ready:
    // const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
    // if (!token) router.replace("/login");
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-[#060E1A]">
        <p className="text-slate-500">Loading admin…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-[#060E1A]">
      <aside className="flex w-60 shrink-0 flex-col bg-slate-900">
        <div className="border-b border-slate-800 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-sm">
              🛡️
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wide text-teal-400">
                TUTOR BE BETEA
              </p>
              <p className="text-xs font-bold text-white">Admin Console</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {SIDEBAR.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                  active
                    ? "bg-teal-600 font-semibold text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <div className="mb-2 flex gap-2 px-1">
            <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400">
              3 flagged
            </span>
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">
              2 disputes
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("admin_token");
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="w-full rounded-xl border border-slate-700 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-[#0A1628]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-slate-500">
              Admin Console · Immutable audit · AES-256 vault
            </p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-500">Systems operational</span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
}