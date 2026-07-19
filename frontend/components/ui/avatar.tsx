import { cn } from '@/lib/utils/format-helpers';

export function Avatar({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn('h-10 w-10 overflow-hidden rounded-full bg-slate-200', className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-600">
          {alt.slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  );
}
