export function MessageList({
  messages,
}: {
  messages: { id: string; body: string; fromSelf?: boolean }[];
}) {
  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-4">
      {messages.length === 0 && <p className="text-sm text-slate-500">No messages yet.</p>}
      {messages.map((m) => (
        <div
          key={m.id}
          className={`max-w-[80%] rounded-md px-3 py-2 text-sm ${
            m.fromSelf ? 'ml-auto bg-brand-700 text-white' : 'bg-slate-100 text-slate-800'
          }`}
        >
          {m.body}
        </div>
      ))}
    </div>
  );
}
