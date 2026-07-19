import { cn } from '@/lib/utils/format-helpers';

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-500',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
