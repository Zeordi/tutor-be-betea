'use client';

import { Calendar } from '@/components/ui/calendar';

export function CalendarView({ onSelect }: { onSelect?: (d: Date) => void }) {
  return <Calendar onChange={onSelect} />;
}
