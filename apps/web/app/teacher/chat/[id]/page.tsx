"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { apiFetch, getToken } from "@/lib/api";";

type ChatMessage = {
  id?: string;
  roomId: string;
  senderId: string;
  content: string;
  originalBlocked?: boolean;
  createdAt?: string;
};

export default function ParentChatPage() {
  const { id: roomId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token || !roomId) return;

    // Optional: decode user id from token payload if available
    try {
      const payload = JSON.parse(atob(token.split(".")[1] || ""));
      setUserId(payload.sub || payload.id || "");
    } catch {
      setUserId("");
    }

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", {
      transports: ["websocket"],
      auth: { token },
    });

    socketRef.current = socket;
    socket.emit("join_room", roomId);

    socket.on("new_message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !roomId) return;

    socketRef.current.emit("send_message", {
      roomId,
      content: input.trim(),
      senderId: userId,
    });

    setInput("");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Chat</h1>
      <p className="text-[var(--secondary)] mb-6">
        Protected by Anti-Poaching Shield.
      </p>

      <div className="card min-h-[480px] flex flex-col">
        <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full min-h-[300px] flex items-center justify-center text-[var(--secondary)]">
              No messages yet. Start the conversation.
            </div>
          ) : (
            messages.map((msg, idx) => {
              const mine = msg.senderId === userId;
              return (
                <div
                  key={msg.id || idx}
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    mine
                      ? "ml-auto bg-[var(--primary)] text-white"
                      : "bg-[var(--surface-2)]"
                  }`}
                >
                  <div>{msg.content}</div>
                  {msg.originalBlocked && (
                    <div className={`text-xs mt-1 ${mine ? "text-white/80" : "text-amber-600"}`}>
                      Contact info was blocked
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)] outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button onClick={sendMessage} className="btn btn-primary">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}