import { cn } from '@/lib/utils/format-helpers';

export function Progress({ value, className }: { value: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-200', className)}>
      <div className="h-full bg-brand-700 transition-all" style={{ width: `${clamped}%` }} />
    </div>
  );
}
