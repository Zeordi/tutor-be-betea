import { cn } from '@/lib/utils/format-helpers';

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-900',
        className,
      )}
      {...props}
    />
  );
}
