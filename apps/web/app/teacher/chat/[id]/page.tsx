"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TeacherChatPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    setMessages([]);
  }, [id]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: input.trim(),
        mine: true,
      },
    ]);
    setInput("");
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Chat</h1>
        <p className="text-[var(--secondary)] mb-6">
          All communication stays on-platform. Contact info is auto-protected.
        </p>

        <div className="card min-h-[420px] flex flex-col">
          <div className="flex-1 space-y-3 mb-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[var(--secondary)]">
                No messages yet.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.mine
                      ? "ml-auto bg-[var(--primary)] text-white"
                      : "bg-[var(--surface-2)]"
                  }`}
                >
                  {msg.content}
                </div>
              ))
            )}
          </div>

          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            />
            <button onClick={sendMessage} className="btn btn-primary">
              Send
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}