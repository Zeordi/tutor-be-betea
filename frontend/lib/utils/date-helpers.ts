import { format, parseISO } from 'date-fns';

export function formatDateTime(value: string | Date) {
  const date = typeof value === 'string' ? parseISO(value) : value;
  return format(date, 'MMM d, yyyy · h:mm a');
}

export function formatDate(value: string | Date) {
  const date = typeof value === 'string' ? parseISO(value) : value;
  return format(date, 'MMM d, yyyy');
}
