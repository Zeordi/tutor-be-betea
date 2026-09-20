"use client";

import { useEffect, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

const TABS = ["All", "JOBS", "SESSIONS", "PAYOUTS", "SYSTEM"] as const;

function typeIcon(t: string) {
  const m: Record<string, string> = {
    JOBS: "⚡",
    SESSIONS: "📅",
    PAYOUTS: "💰",
    SYSTEM: "🛡️",
  };
  return m[t] || "🔔";
}

function labelFor(t: string) {
  return t in { JOBS: 1, SESSIONS: 1, PAYOUTS: 1, SYSTEM: 1 } ? t : "SYSTEM";
}

export default function TeacherNotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<Notification[]>([]);
  const [tab, setTab] = useState("All");

  const unreadCount = items.filter((n) => !n.read).length;

  const list = tab === "All" ? items : items.filter((n) => n.type === tab);

  const markAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await apiFetch(paths.notificationsReadAll, { method: "POST" });
    } catch {}
  };

  const markRead = async (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    try {
      await apiFetch(paths.notificationRead(id), { method: "POST" });
    } catch {}
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

  useEffect(() => {
    if (unreadCount > 0) {
      apiFetch(paths.notificationsReadAll, { method: "POST" }).catch(() => {});
    }
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="flex gap-2">
          {TABS.map((t) => (
            <div key={t} className="h-8 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text)]">Notifications</h1>
        <p className="text-sm text-[var(--secondary)]">Job alerts, sessions, and payouts</p>
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

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold ${
              tab === t
                ? "bg-[var(--primary)] text-white"
                : "border border-[var(--border)] bg-[var(--card)] text-[var(--secondary)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {list.map((n) => (
          <div
            key={n.id}
            className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            {!n.read && (
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" />
            )}
            <div className={`min-w-0 flex-1 ${n.read ? "ml-4" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-[var(--text)]">{n.title}</p>
                <span className="text-xs text-[var(--secondary)]">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
              {n.body && (
                <p className="text-sm text-[var(--secondary)]">{n.body}</p>
              )}
              {!n.read && (
                <button
                  type="button"
                  onClick={() => markRead(n.id)}
                  className="mt-1 text-[10px] font-bold text-[var(--primary)]"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-sm text-[var(--secondary)]">No notifications in this category.</p>
        )}
      </div>
    </div>
  );
}
