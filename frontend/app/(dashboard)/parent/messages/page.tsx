'use client';

import { Suspense } from 'react';
import { MessagesWorkspace } from '@/components/chat/messages-workspace';

export default function ParentMessagesPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl p-6 text-slate-600">Loading messages…</main>
      }
    >
      <MessagesWorkspace role="parent" />
    </Suspense>
  );
}
