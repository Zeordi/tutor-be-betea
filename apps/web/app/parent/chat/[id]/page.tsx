"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, paths } from "@/lib/api";

type Msg = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  originalBlocked?: boolean;
};



export default function ParentChatThreadPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "1";
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");

  const title = useMemo(() => {
    if (id === "2") return "Selamawit Bekele";
    if (id === "3") return "Dawit Haile";
    return "Berhane Alemu";
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setMessages([]);
    apiFetch<{ id: string; content: string; senderId: string; createdAt: string; originalBlocked?: boolean }[]>(paths.chatMessages(id))
      .then((data) => {
        if (!cancelled) {
          setMessages(
            (data || []).map((m) => ({
              id: m.id,
              from: m.senderId === id ? "them" : "me",
              text: m.content,
              time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              originalBlocked: m.originalBlocked,
            }))
          );
        }
      })
      .catch(() => {
        if (!cancelled) setMessages([]);
      });
    return () => { cancelled = true; };
  }, [id]);

  const send = async () => {
    const raw = draft.trim();
    if (!raw) return;
    const tempId = `temp-${Date.now()}`;
    const optimistic: Msg = {
      id: tempId,
      from: "me",
      text: raw,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, optimistic]);
    setDraft("");
    try {
      const saved = await apiFetch<{ id: string; content: string; originalBlocked?: boolean }>(
        `/chat/${id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: raw }),
        },
      );
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...m,
                id: saved.id || tempId,
                text: saved.content,
                originalBlocked: saved.originalBlocked || false,
              }
            : m,
        ),
      );
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => router.push("/parent/chat")}
            className="mb-1 text-sm font-semibold text-[var(--secondary)] hover:text-[var(--primary)]"
          >
            ← All messages
          </button>
          <h1 className="text-xl font-black text-[var(--foreground)]">{title}</h1>
          <p className="text-xs text-[var(--secondary)]">Encrypted · on-platform only</p>
        </div>
        <Link
          href={`/parent/tutors/${id}`}
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-bold text-[var(--foreground)]"
        >
          View profile
        </Link>
      </div>

      <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12px] font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        🛡️ Anti-poaching: phone, Telegram, email, and bank numbers are replaced with
        [RESTRICTED CONTACT INFO]. Keep coordination here to stay covered by escrow.
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  m.from === "me"
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--muted)] text-[var(--foreground)]"
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>
                 <div
                   className={`mt-1 flex items-center gap-2 text-[10px] ${
                     m.from === "me" ? "text-white/70" : "text-[var(--secondary)]"
                   }`}
                 >
                   <span>{m.time}</span>
                   {m.originalBlocked && (
                     <span className="rounded bg-black/10 px-1.5 py-0.5 font-bold">
                       Contact info blocked
                     </span>
                   )}
                 </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--border)] p-3">
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Type a message…"
              className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
            />
            <button
              type="button"
              onClick={send}
              className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}