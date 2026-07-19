'use client';

import { Input } from '@/components/ui/input';

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      placeholder="Search subjects, teachers, location…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search teachers"
    />
  );
}
