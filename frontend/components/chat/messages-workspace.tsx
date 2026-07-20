'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2, MessageCircle } from 'lucide-react';
import { ChatWindow } from '@/components/chat/chat-window';
import { useBookings, type BookingRow } from '@/lib/hooks/use-bookings';

function formatWhen(booking: BookingRow) {
  try {
    const date = new Date(booking.bookingDate).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    return `${date} · ${booking.startTime}–${booking.endTime}`;
  } catch {
    return `${booking.startTime}–${booking.endTime}`;
  }
}

type MessagesWorkspaceProps = {
  role: 'parent' | 'teacher';
};

export function MessagesWorkspace({ role }: MessagesWorkspaceProps) {
  const searchParams = useSearchParams();
  const initialBookingId = searchParams.get('bookingId') || '';
  const { bookings, loading, error } = useBookings();
  const [activeId, setActiveId] = useState(initialBookingId);

  useEffect(() => {
    if (initialBookingId) setActiveId(initialBookingId);
  }, [initialBookingId]);

  const threads = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const aTime = new Date(a.bookingDate).getTime();
      const bTime = new Date(b.bookingDate).getTime();
      return bTime - aTime;
    });
  }, [bookings]);

  useEffect(() => {
    if (!activeId && threads[0]?.id) {
      setActiveId(threads[0].id);
    }
  }, [activeId, threads]);

  const active = threads.find((b) => b.id === activeId) || null;
  const counterpartName =
    role === 'parent' ? active?.teacher?.name || 'Teacher' : active?.parent?.name || 'Parent';
  const bookingsHref = role === 'parent' ? '/parent/bookings' : '/teacher/bookings';

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Messages</h1>
        <p className="mt-2 text-slate-600">
          Booking-threaded chat with your {role === 'parent' ? 'teachers' : 'parents'}
        </p>
      </div>

      {loading ? (
        <p className="inline-flex items-center gap-2 text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading conversations…
        </p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {!loading && !error && threads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-slate-600">
          <MessageCircle className="mx-auto mb-3 h-8 w-8 text-slate-400" />
          <p>No booking threads yet.</p>
          <Link href={bookingsHref} className="mt-3 inline-block font-medium text-tutor-green-700">
            Go to bookings
          </Link>
        </div>
      ) : null}

      {threads.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-4 py-3 text-sm font-medium text-slate-700">
              Conversations
            </div>
            <ul className="max-h-[min(70vh,560px)] overflow-y-auto">
              {threads.map((booking) => {
                const name =
                  role === 'parent'
                    ? booking.teacher?.name || 'Teacher'
                    : booking.parent?.name || 'Parent';
                const selected = booking.id === activeId;
                return (
                  <li key={booking.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(booking.id)}
                      className={`w-full border-b border-gray-50 px-4 py-3 text-left transition ${
                        selected ? 'bg-tutor-green-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium text-slate-900">{name}</p>
                      <p className="text-xs text-slate-500">{formatWhen(booking)}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                        {booking.status.replace('_', ' ')} · {booking.studentName}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <section>
            {active ? (
              <ChatWindow
                bookingId={active.id}
                title={counterpartName}
                subtitle={`${formatWhen(active)} · ${active.studentName}`}
              />
            ) : (
              <div className="flex h-[min(70vh,560px)] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white text-slate-500">
                Select a booking conversation
              </div>
            )}
          </section>
        </div>
      ) : null}
    </main>
  );
}
