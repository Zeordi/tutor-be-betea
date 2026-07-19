import { cn } from '@/lib/utils/format-helpers';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
};

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-50',
        variant === 'default' && 'bg-brand-700 text-white hover:bg-brand-900',
        variant === 'outline' && 'border border-slate-300 bg-white hover:bg-slate-50',
        variant === 'ghost' && 'hover:bg-slate-100',
        className,
      )}
      {...props}
    />
  );
}
