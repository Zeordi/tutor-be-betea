"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ParentNotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10">
        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-[var(--secondary)] mb-8">
          Stay updated on jobs, contracts, and tutor activity.
        </p>

        {loading ? (
          <p className="text-[var(--secondary)]">Loading...</p>
        ) : items.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-xl font-bold mb-2">No notifications</h3>
            <p className="text-[var(--secondary)]">You’re all caught up.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="card">
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-[var(--secondary)] mt-1">{item.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}