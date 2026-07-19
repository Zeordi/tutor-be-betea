'use client';

import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { useChat } from '@/lib/hooks/use-chat';

export function ChatWindow({ conversationId }: { conversationId: string }) {
  const { messages, sendMessage } = useChat(conversationId);

  return (
    <div className="flex h-[480px] flex-col border border-slate-200 bg-white">
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
}
