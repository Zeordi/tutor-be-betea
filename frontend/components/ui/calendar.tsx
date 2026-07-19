'use client';

import { format } from 'date-fns';

type CalendarProps = {
  value?: Date;
  onChange?: (date: Date) => void;
};

export function Calendar({ value = new Date(), onChange }: CalendarProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm font-medium text-slate-700">{format(value, 'MMMM yyyy')}</p>
      <button
        type="button"
        className="mt-3 rounded-md bg-brand-700 px-3 py-1.5 text-sm text-white"
        onClick={() => onChange?.(new Date())}
      >
        Select today
      </button>
    </div>
  );
}
