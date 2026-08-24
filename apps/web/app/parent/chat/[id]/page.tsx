"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ParentChatPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Placeholder: connect to websocket / load history later
    setMessages([]);
  }, [id]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      mine: true,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Chat</h1>
        <p className="text-[var(--secondary)] mb-6">
          Protected by Anti-Poaching Shield. Contact details are blocked automatically.
        </p>

        <div className="card min-h-[420px] flex flex-col">
          <div className="flex-1 space-y-3 mb-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[var(--secondary)]">
                No messages yet. Start the conversation.
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