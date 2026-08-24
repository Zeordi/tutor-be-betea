"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/teacher", label: "Dashboard" },
  { href: "/teacher/jobs", label: "Available Jobs" },
  { href: "/teacher/contracts", label: "My Contracts" },
  { href: "/teacher/verification", label: "Verification" },
  { href: "/teacher/earnings", label: "Earnings" },
  { href: "/teacher/progress/submit", label: "Submit Progress" },
  { href: "/teacher/profile", label: "Profile & Badges" },
  { href: "/teacher/notifications", label: "Notifications" },
  { href: "/teacher/settings", label: "Settings" },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
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
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--secondary)]">Checking authentication...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr] bg-[var(--background)]">
      <aside className="border-r border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="text-xl font-bold text-[var(--primary)] mb-8">
          Tutor Be Betea
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/teacher" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--secondary)] hover:bg-[var(--surface-2)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="btn btn-secondary w-full mt-8"
        >
          Logout
        </button>
      </aside>

      <main className="p-6 md:p-8">{children}</main>
    </div>
  );
}