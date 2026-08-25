"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ChildrenPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parents/children`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setChildren(Array.isArray(data) ? data : []);
      } catch {
        setChildren([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Children</h1>
            <p className="text-[var(--secondary)]">
              Manage student profiles for multi-child accounts.
            </p>
          </div>
          <Link href="/parent/children/add" className="btn btn-primary">
            Add Child
          </Link>
        </div>

        {loading ? (
          <p className="text-[var(--secondary)]">Loading...</p>
        ) : children.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-xl font-bold mb-2">No children added</h3>
            <p className="text-[var(--secondary)] mb-4">
              Add your first child profile to post jobs and track progress.
            </p>
            <Link href="/parent/children/add" className="btn btn-primary">
              Add Child
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {children.map((child) => (
              <div key={child.id} className="card">
                <h3 className="font-bold text-lg">{child.studentName}</h3>
                <p className="text-sm text-[var(--secondary)] mt-1">
                  Grade: {child.gradeLevel}
                </p>
                <p className="text-sm text-[var(--secondary)]">
                  Curriculum: {child.curriculum}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}