'use client';

import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { useChat } from '@/lib/hooks/use-chat';

type ChatWindowProps = {
  bookingId: string;
  title?: string;
  subtitle?: string;
};

export function ChatWindow({ bookingId, title, subtitle }: ChatWindowProps) {
  const { messages, sendMessage, notifyTyping, peerTyping, connected, loading, error } = useChat({
    bookingId,
  });

  return (
    <div className="flex h-[min(70vh,560px)] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-900">{title || 'Booking chat'}</h2>
            {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              connected
                ? 'bg-tutor-green-50 text-tutor-green-800'
                : 'bg-amber-50 text-amber-800'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-tutor-green-600' : 'bg-amber-500'}`}
            />
            {connected ? 'Live' : 'Connecting…'}
          </span>
        </div>
        {peerTyping ? <p className="mt-1 text-xs text-slate-500">Typing…</p> : null}
        {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
          Loading messages…
        </div>
      ) : (
        <MessageList messages={messages} />
      )}

      <MessageInput
        onSend={sendMessage}
        onTypingChange={notifyTyping}
        disabled={!connected && !loading}
      />
    </div>
  );
}
