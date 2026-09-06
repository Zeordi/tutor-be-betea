"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
  { href: "/impersonation", id: "impersonation", icon: "👁️", label: "User Impersonation", roles: ["super"] },
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

  useEffect(() => {
    setReady(true);
    const saved =
      typeof window !== "undefined"
        ? (localStorage.getItem("admin_role") as AdminRole | null)
        : null;
    if (saved && ROLE_META[saved]) setRole(saved);
  }, [router]);

  const setRolePersist = (r: AdminRole) => {
    setRole(r);
    localStorage.setItem("admin_role", r);
  };

  const lockedCount = useMemo(
    () => SIDEBAR.filter((i) => !i.roles.includes(role)).length,
    [role]
  );

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
          <div className="mb-3 flex items-center gap-2">
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
          {/* RBAC role switcher — dims locked nav */}
          <div className="grid grid-cols-2 gap-1">
            {(Object.keys(ROLE_META) as AdminRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRolePersist(r)}
                className={`rounded-lg px-2 py-1.5 text-[10px] font-bold ${
                  role === r ? "text-white" : "bg-slate-800 text-slate-400"
                }`}
                style={
                  role === r
                    ? { backgroundColor: ROLE_META[r].color }
                    : undefined
                }
              >
                {ROLE_META[r].label}
              </button>
            ))}
          </div>
          {lockedCount > 0 && (
            <p className="mt-2 text-[10px] text-slate-500">
              {lockedCount} nav items locked for this role
            </p>
          )}
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
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
                  className="flex w-full cursor-not-allowed items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 opacity-40"
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
              Admin Console · Role:{" "}
              <span style={{ color: ROLE_META[role].color }}>
                {ROLE_META[role].label}
              </span>{" "}
              · AES-256 vault · audit on
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