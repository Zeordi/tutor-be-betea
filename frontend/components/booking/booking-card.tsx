import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils/date-helpers';

export function BookingCard({
  teacherName,
  startsAt,
  status,
}: {
  teacherName: string;
  startsAt: string;
  status: string;
}) {
  return (
    <article className="border-b border-slate-200 py-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-medium">{teacherName}</h3>
        <Badge>{status}</Badge>
      </div>
      <p className="mt-1 text-sm text-slate-600">{formatDateTime(startsAt)}</p>
    </article>
  );
}
