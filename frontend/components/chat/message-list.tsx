'use client';

import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/lib/hooks/use-chat';

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <p className="text-sm text-slate-500">No messages yet. Say hello to start the thread.</p>
      ) : null}
      {messages.map((m) => (
        <div
          key={m.id}
          className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
            m.fromSelf
              ? 'ml-auto bg-tutor-green-600 text-white'
              : 'bg-slate-100 text-slate-800'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{m.message}</p>
          {m.createdAt ? (
            <p
              className={`mt-1 text-[10px] ${
                m.fromSelf ? 'text-white/70' : 'text-slate-500'
              }`}
            >
              {new Date(m.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          ) : null}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
