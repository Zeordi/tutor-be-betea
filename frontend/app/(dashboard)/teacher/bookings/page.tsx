'use client';

import { useMemo, useState } from 'react';
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

export default function TeacherBookingsPage() {
  const { bookings, loading, error, refresh, confirmBooking, completeBooking, cancelBooking } =
    useBookings();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const [actionInfo, setActionInfo] = useState('');

  const pending = useMemo(
    () => bookings.filter((b) => b.status === 'PENDING'),
    [bookings],
  );
  const active = useMemo(
    () => bookings.filter((b) => ['CONFIRMED', 'IN_PROGRESS'].includes(b.status)),
    [bookings],
  );
  const other = useMemo(
    () => bookings.filter((b) => ['COMPLETED', 'CANCELLED', 'DISPUTED'].includes(b.status)),
    [bookings],
  );

  async function runAction(
    id: string,
    action: 'confirm' | 'complete' | 'cancel',
  ) {
    setActionError('');
    setActionInfo('');
    setBusyId(id);
    try {
      if (action === 'confirm') {
        const result = (await confirmBooking(id)) as {
          clientSecret?: string;
          message?: string;
        };
        setActionInfo(
          result?.message ||
            'Accepted. Parent must complete payment with the returned client secret before the booking is confirmed.',
        );
      } else if (action === 'complete') {
        await completeBooking(id);
        setActionInfo('Lesson marked complete.');
      } else {
        await cancelBooking(id, 'Cancelled by teacher');
        setActionInfo('Booking cancelled.');
      }
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setBusyId(null);
    }
  }

  function Card({ booking }: { booking: BookingRow }) {
    return (
      <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {booking.parent?.name || 'Parent'} · {booking.studentName}
            </h2>
            <p className="text-sm text-slate-600">Age {booking.studentAge}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p>
            <span className="font-medium text-slate-800">When:</span>{' '}
            {formatDate(booking.bookingDate)} · {booking.startTime}–{booking.endTime}
          </p>
          <p>
            <span className="font-medium text-slate-800">Amount:</span> $
            {Number(booking.totalAmount).toFixed(2)}
          </p>
          {booking.learningGoals ? (
            <p className="sm:col-span-2">
              <span className="font-medium text-slate-800">Goals:</span> {booking.learningGoals}
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {booking.status === 'PENDING' ? (
            <button
              type="button"
              disabled={busyId === booking.id}
              onClick={() => void runAction(booking.id, 'confirm')}
              className="rounded-lg bg-tutor-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-tutor-green-700 disabled:opacity-60"
            >
              {busyId === booking.id ? 'Working…' : 'Accept (create payment)'}
            </button>
          ) : null}
          {booking.status === 'CONFIRMED' || booking.status === 'IN_PROGRESS' ? (
            <button
              type="button"
              disabled={busyId === booking.id}
              onClick={() => void runAction(booking.id, 'complete')}
              className="rounded-lg bg-tutor-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-tutor-green-700 disabled:opacity-60"
            >
              {busyId === booking.id ? 'Working…' : 'Mark complete'}
            </button>
          ) : null}
          {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' ? (
            <button
              type="button"
              disabled={busyId === booking.id}
              onClick={() => void runAction(booking.id, 'cancel')}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Bookings</h1>
      <p className="mt-2 text-slate-600">
        Accept requests to create a Stripe payment intent. Booking stays pending until the parent pays.
      </p>

      {loading ? (
        <p className="mt-8 inline-flex items-center gap-2 text-slate-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading bookings…
        </p>
      ) : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {actionError ? <p className="mt-4 text-sm text-amber-700">{actionError}</p> : null}
      {actionInfo ? <p className="mt-4 text-sm text-tutor-green-700">{actionInfo}</p> : null}

      {!loading && !error && bookings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-slate-600">
          No booking requests yet.
        </div>
      ) : null}

      {pending.length ? (
        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Requests</h2>
          {pending.map((booking) => (
            <Card key={booking.id} booking={booking} />
          ))}
        </section>
      ) : null}

      {active.length ? (
        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Confirmed</h2>
          {active.map((booking) => (
            <Card key={booking.id} booking={booking} />
          ))}
        </section>
      ) : null}

      {other.length ? (
        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">History</h2>
          {other.map((booking) => (
            <Card key={booking.id} booking={booking} />
          ))}
        </section>
      ) : null}
    </main>
  );
}
