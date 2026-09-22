"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type Conversation = {
  id: string;
  otherUser: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  lastMessage: {
    body: string;
    createdAt: string;
  } | null;
  unreadCount: number;
};

export default function ParentChatInboxPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiFetch<Conversation[]>(paths.chatConversations)
      .then((data) => {
        if (!cancelled) setConversations(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load conversations");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const diff = (Date.now() - d.getTime()) / 60000;
    if (diff < 60) return `${Math.floor(diff)}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 h-8 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-slate-100/60 p-4 dark:bg-slate-800">
              <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl p-6">
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
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--foreground)]">Messages</h1>
        <p className="mt-1 text-sm text-[var(--secondary)]">
          On-platform chat only · contact details are blocked for escrow & safety
        </p>
      </div>

      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        🛡️ Anti-poaching shield active — phone numbers, Telegram, and bank accounts are
        redacted automatically.
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        {conversations.map((c, i) => (
          <Link
            key={c.id}
            href={`/parent/chat/${c.id}`}
            className={`flex items-center gap-3 px-4 py-4 transition hover:bg-[var(--muted)] ${
              i < conversations.length - 1 ? "border-b border-[var(--border)]" : ""
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-teal-300 text-xl">
              {c.otherUser.avatarUrl ? (
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={c.otherUser.avatarUrl}
                  alt={c.otherUser.fullName}
                />
              ) : (
                initials(c.otherUser.fullName)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-bold text-[var(--foreground)]">{c.otherUser.fullName}</p>
                {c.lastMessage && (
                  <span className="shrink-0 text-xs text-[var(--secondary)]">
                    {formatTime(c.lastMessage.createdAt)}
                  </span>
                )}
              </div>
              {c.lastMessage && (
                <p className="mt-0.5 truncate text-sm text-[var(--secondary)]">{c.lastMessage.body}</p>
              )}
            </div>
            {c.unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--primary)] px-1.5 text-[11px] font-bold text-white">
                {c.unreadCount}
              </span>
            )}
          </Link>
        ))}
      </div>

      {conversations.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--secondary)]">
          No conversations yet. Start a conversation from a tutor's profile.
        </div>
      )}
    </div>
  );
}
