'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { ToastProvider } from '@/lib/providers/toast-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        {children}
        <Toaster position="top-right" />
      </ToastProvider>
    </SessionProvider>
  );
}
