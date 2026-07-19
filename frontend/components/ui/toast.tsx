import { cn } from '@/lib/utils/format-helpers';

export function Toast({
  message,
  variant = 'default',
}: {
  message: string;
  variant?: 'default' | 'error' | 'success';
}) {
  return (
    <div
      className={cn(
        'rounded-md px-4 py-3 text-sm shadow-md',
        variant === 'default' && 'bg-slate-900 text-white',
        variant === 'error' && 'bg-red-600 text-white',
        variant === 'success' && 'bg-brand-700 text-white',
      )}
    >
      {message}
    </div>
  );
}
