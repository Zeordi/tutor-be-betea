"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ParentDashboardPage() {
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
      title: "Find Tutors",
      desc: "Browse verified tutors near you",
      href: "/parent/tutors",
    },
    {
      title: "Post a Job",
      desc: "Tell us what your child needs",
      href: "/parent/jobs/create",
    },
    {
      title: "My Children",
      desc: "Manage student profiles",
      href: "/parent/children",
    },
    {
      title: "Contracts",
      desc: "Track escrow and sessions",
      href: "/parent/contracts",
    },
    {
      title: "Progress Reports",
      desc: "View weekly learning updates",
      href: "/parent/progress",
    },
    {
      title: "Wallet",
      desc: "Payments and escrow balance",
      href: "/parent/wallet",
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
        <h1 className="text-3xl font-bold mb-2">Parent Dashboard</h1>
        <p className="text-[var(--secondary)] mb-8">
          Welcome back. Manage tutoring with trust, safety, and clear progress.
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