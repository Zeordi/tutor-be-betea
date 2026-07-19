'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function MessageInput({ onSend }: { onSend: (body: string) => void }) {
  const [body, setBody] = useState('');

  return (
    <form
      className="flex gap-2 border-t p-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!body.trim()) return;
        onSend(body.trim());
        setBody('');
      }}
    >
      <Input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type a message…" />
      <Button type="submit">Send</Button>
    </form>
  );
}
