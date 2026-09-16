"use client";

import { useEffect, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  data: any;
  read: boolean;
  createdAt: string;
};

const TAB_CATEGORIES = ["All", "SESSIONS", "ESCROW", "CHAT", "SYSTEM", "PAYMENT"] as const;
type TabCategory = (typeof TAB_CATEGORIES)[number];

function catIcon(cat: string) {
  const m: Record<string, string> = {
    SESSIONS: "📅",
    ESCROW: "🔒",
    CHAT: "💬",
    SYSTEM: "🛡️",
    PAYMENT: "💳",
  };
  return m[cat] || "🔔";
}

function catLabel(cat: string) {
  return TAB_CATEGORIES.find((t) => t === cat) || "SYSTEM";
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<TabCategory>("All");

  const unreadCount = items.filter((n) => !n.read).length;

  const list =
    filter === "All" ? items : items.filter((n) => n.type === filter);

  const markAllRead = async () => {
    const updated = items.map((n) => ({ ...n, read: true }));
    setItems(updated);
    try {
      await apiFetch(paths.notificationsReadAll, { method: "POST" });
    } catch {
      // best-effort; local state already updated
    }
  };

  const markRead = async (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    try {
      await apiFetch(paths.notificationRead(id), { method: "POST" });
    } catch {
      // best-effort
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<Notification[]>(paths.notifications)
      .then((data) => {
        if (!cancelled) setItems(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load notifications");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mb-5 flex flex-wrap gap-2">
          {TAB_CATEGORIES.map((f) => (
            <div key={f} className="h-8 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-3xl">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">Notifications</h1>
          <p className="text-sm text-[var(--secondary)]">
            {unreadCount} unread
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="text-xs font-bold text-[var(--primary)]"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {TAB_CATEGORIES.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-[13px] font-bold ${
              filter === f
                ? "border-[var(--primary)] bg-teal-50 text-[var(--primary)] dark:bg-teal-950/40"
                : "border-[var(--border)] text-[var(--secondary)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {list.map((n) => (
          <div
            key={n.id}
            className={`flex gap-3.5 rounded-2xl border p-4 ${
              !n.read
                ? "border-teal-200 bg-teal-50/80 dark:border-teal-900 dark:bg-teal-950/20"
                : "border-[var(--border)] bg-[var(--card)]"
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--muted)] text-xl">
              {catIcon(n.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex justify-between gap-2">
                <p
                  className={`text-sm text-[var(--foreground)] ${
                    !n.read ? "font-extrabold" : "font-semibold"
                  }`}
                >
                  {n.title}
                </p>
                <span className="shrink-0 text-xs text-[var(--secondary)]">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
              {n.body && <p className="text-[13px] text-[var(--secondary)]">{n.body}</p>}
              <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wide text-[var(--secondary)]">
                {catLabel(n.type)}
              </span>
            </div>
            {!n.read && (
              <span
                className="mt-2 h-2 w-2 shrink-0 cursor-pointer rounded-full bg-[var(--primary)]"
                onClick={() => markRead(n.id)}
                title="Mark as read"
              />
            )}
          </div>
        ))}
        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--secondary)]">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
}
