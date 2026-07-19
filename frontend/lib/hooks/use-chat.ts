'use client';

import { useCallback, useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

type Message = { id: string; body: string; fromSelf?: boolean };

export function useChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4000';
    const s = io(`${wsUrl}/chat`, { query: { conversationId } });
    setSocket(s);
    s.on('message', (msg: Message) => setMessages((prev) => [...prev, msg]));
    return () => {
      s.disconnect();
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    (body: string) => {
      const local: Message = { id: crypto.randomUUID(), body, fromSelf: true };
      setMessages((prev) => [...prev, local]);
      socket?.emit('message', { conversationId, body });
    },
    [conversationId, socket],
  );

  return { messages, sendMessage };
}
