'use client';

import { createContext, useCallback, useMemo, useState } from 'react';
import { Toast } from '@/components/ui/toast';

type ToastItem = { id: string; message: string; variant?: 'default' | 'error' | 'success' };

type ToastContextValue = {
  toast: (message: string, variant?: ToastItem['variant']) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, variant: ToastItem['variant'] = 'default') => {
    const id = crypto.randomUUID();
    setItems((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {items.map((item) => (
          <Toast key={item.id} message={item.message} variant={item.variant} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
