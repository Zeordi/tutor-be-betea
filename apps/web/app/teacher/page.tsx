"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherDashboardPage() {
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

  const actions = [
    {
      title: "Available Jobs",
      desc: "Browse open tutoring requests from parents",
      href: "/teacher/jobs",
    },
    {
      title: "My Contracts",
      desc: "Track active contracts and sessions",
      href: "/teacher/contracts",
    },
    {
      title: "Verification",
      desc: "Upload ID and degree documents",
      href: "/teacher/verification",
    },
    {
      title: "Earnings",
      desc: "View balance and payout history",
      href: "/teacher/earnings",
    },
    {
      title: "Progress Reports",
      desc: "Submit weekly student updates",
      href: "/teacher/progress/submit",
    },
    {
      title: "My Profile & Badges",
      desc: "Manage profile and Trust Badges",
      href: "/teacher/profile",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Top bar */}
      <header className="border-b border-[var(--border)] bg-[var(--background)]">
        <div className="container flex items-center justify-between py-4">
          <div className="text-xl font-bold text-[var(--primary)]">
            Tutor Be Betea
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="btn btn-secondary text-sm px-4 py-2"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard content */}
      <section className="container py-10">
        <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-[var(--secondary)] mb-8">
          Welcome back. Manage jobs, contracts, verification, and your tutoring sessions.
        </p>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {actions.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="card hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--secondary)]">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}