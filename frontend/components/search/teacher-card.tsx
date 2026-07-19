import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type TeacherCardProps = {
  id: string;
  name: string;
  subjects: string[];
  hourlyRate: number;
  avatarUrl?: string;
};

export function TeacherCard({ id, name, subjects, hourlyRate, avatarUrl }: TeacherCardProps) {
  return (
    <Link
      href={`/parent/teacher/${id}`}
      className="block border-b border-slate-200 py-4 transition hover:bg-white/60"
    >
      <div className="flex items-start gap-3">
        <Avatar src={avatarUrl} alt={name} />
        <div>
          <p className="font-medium text-slate-900">{name}</p>
          <p className="text-sm text-slate-600">${hourlyRate}/hr</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {subjects.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
