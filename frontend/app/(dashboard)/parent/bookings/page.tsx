'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useBookings, type BookingRow } from '@/lib/hooks/use-bookings';

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return value;
  }
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'CONFIRMED' || status === 'COMPLETED'
      ? 'bg-tutor-green-50 text-tutor-green-800'
      : status === 'CANCELLED'
        ? 'bg-red-50 text-red-700'
        : 'bg-amber-50 text-amber-800';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function BookingCard({
  booking,
  onCancel,
  busyId,
}: {
  booking: BookingRow;
  onCancel: (id: string) => void;
  busyId: string | null;
}) {
  const paymentStatus = booking.payments?.[0]?.status;
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {booking.teacher?.name || 'Teacher'}
          </h2>
          <p className="text-sm text-slate-600">
            {booking.studentName} · age {booking.studentAge}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <p>
          <span className="font-medium text-slate-800">When:</span>{' '}
          {formatDate(booking.bookingDate)} · {booking.startTime}–{booking.endTime}
        </p>
        <p>
          <span className="font-medium text-slate-800">Amount:</span> ${booking.totalAmount.toFixed(2)}
        </p>
        {booking.learningGoals ? (
          <p className="sm:col-span-2">
            <span className="font-medium text-slate-800">Goals:</span> {booking.learningGoals}
          </p>
        ) : null}
        {paymentStatus ? (
          <p>
            <span className="font-medium text-slate-800">Payment:</span> {paymentStatus}
          </p>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {booking.teacherId ? (
          <Link
            href={`/parent/teacher/${booking.teacherId}`}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          >
            View teacher
          </Link>
        ) : null}
        {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' ? (
          <button
            type="button"
            disabled={busyId === booking.id}
            onClick={() => onCancel(booking.id)}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            {busyId === booking.id ? 'Cancelling…' : 'Cancel'}
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default function ParentBookingsPage() {
  const { bookings, loading, error, refresh, cancelBooking } = useBookings();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const grouped = useMemo(() => {
    const upcoming = bookings.filter((b) =>
      ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status),
    );
    const past = bookings.filter((b) => ['COMPLETED', 'CANCELLED', 'DISPUTED'].includes(b.status));
    return { upcoming, past };
  }, [bookings]);

  async function onCancel(id: string) {
    setActionError('');
    setBusyId(id);
    try {
      await cancelBooking(id, 'Cancelled by parent');
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Cancel failed');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My bookings</h1>
          <p className="mt-2 text-slate-600">Upcoming and past sessions</p>
        </div>
        <Link
          href="/parent/search"
          className="rounded-xl bg-tutor-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-tutor-green-700"
        >
          Find a teacher
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 inline-flex items-center gap-2 text-slate-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading bookings…
        </p>
      ) : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {actionError ? <p className="mt-4 text-sm text-amber-700">{actionError}</p> : null}

      {!loading && !error && bookings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-slate-600">
          No bookings yet. Search for a teacher and request a lesson.
        </div>
      ) : null}

      {grouped.upcoming.length ? (
        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming</h2>
          {grouped.upcoming.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={onCancel}
              busyId={busyId}
            />
          ))}
        </section>
      ) : null}

      {grouped.past.length ? (
        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Past</h2>
          {grouped.past.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={onCancel}
              busyId={busyId}
            />
          ))}
        </section>
      ) : null}
    </main>
  );
}
