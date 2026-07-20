'use client';

import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  useAdminDisputes,
  type AdminDispute,
  type ResolveDisputePayload,
} from '@/lib/hooks/use-admin';

function formatDate(value?: string | null) {
  if (!value) return '—';
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

function Badge({ status }: { status: string }) {
  const tone =
    status === 'RESOLVED' || status === 'CLOSED'
      ? 'bg-tutor-green-50 text-tutor-green-800'
      : status === 'REFUNDED'
        ? 'bg-blue-50 text-blue-800'
        : 'bg-amber-50 text-amber-800';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function DisputeCard({
  dispute,
  busyId,
  onResolve,
}: {
  dispute: AdminDispute;
  busyId: string | null;
  onResolve: (dispute: AdminDispute, resolution: 'RELEASE' | 'REFUND') => void;
}) {
  const open = dispute.status === 'OPEN' || dispute.status === 'UNDER_REVIEW';
  const busy = busyId === dispute.id;
  const amount = Number(dispute.booking?.totalAmount || 0);

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{dispute.reason}</h2>
          <p className="text-sm text-slate-600">
            Raised by {dispute.raisedByUser?.fullName || 'User'} ·{' '}
            {dispute.raisedByUser?.email}
          </p>
        </div>
        <Badge status={dispute.status} />
      </div>

      {dispute.description ? (
        <p className="mt-3 text-sm text-slate-600 whitespace-pre-wrap">{dispute.description}</p>
      ) : null}

      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <p>
          <span className="font-medium text-slate-800">Student:</span>{' '}
          {dispute.booking?.studentName || '—'}
        </p>
        <p>
          <span className="font-medium text-slate-800">Amount:</span> ${amount.toFixed(2)}
        </p>
        <p>
          <span className="font-medium text-slate-800">When:</span>{' '}
          {formatDate(dispute.booking?.bookingDate)} · {dispute.booking?.startTime}–
          {dispute.booking?.endTime}
        </p>
        <p>
          <span className="font-medium text-slate-800">Booking:</span>{' '}
          {dispute.booking?.status || '—'}
        </p>
        {dispute.resolution ? (
          <p className="sm:col-span-2">
            <span className="font-medium text-slate-800">Resolution:</span> {dispute.resolution}
            {dispute.resolutionDetails ? ` — ${dispute.resolutionDetails}` : ''}
          </p>
        ) : null}
      </div>

      {open ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onResolve(dispute, 'RELEASE')}
            className="rounded-lg bg-tutor-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-tutor-green-700 disabled:opacity-60"
          >
            {busy ? 'Working…' : 'Release / complete'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onResolve(dispute, 'REFUND')}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            Full refund
          </button>
        </div>
      ) : null}
    </article>
  );
}

export default function AdminDisputesPage() {
  const { disputes, loading, error, refresh, resolveDispute } = useAdminDisputes();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const [notes, setNotes] = useState('Resolved by admin');

  const open = useMemo(
    () => disputes.filter((d) => d.status === 'OPEN' || d.status === 'UNDER_REVIEW'),
    [disputes],
  );
  const closed = useMemo(
    () => disputes.filter((d) => d.status !== 'OPEN' && d.status !== 'UNDER_REVIEW'),
    [disputes],
  );

  async function onResolve(dispute: AdminDispute, resolution: 'RELEASE' | 'REFUND') {
    setActionError('');
    setBusyId(dispute.id);
    try {
      const payload: ResolveDisputePayload = {
        bookingId: dispute.bookingId,
        resolution,
        notes: notes.trim() || `Resolved via ${resolution}`,
      };
      await resolveDispute(payload);
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Resolve failed');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Disputes</h1>
        <p className="mt-2 text-slate-600">
          Resolve booking disputes with release or full refund. Partial refund is not offered here
          because the current Stripe path refunds the full payment.
        </p>
      </div>

      <label className="mb-6 block max-w-xl text-sm text-slate-700">
        Resolution notes
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tutor-green-500"
        />
      </label>

      {loading ? (
        <p className="inline-flex items-center gap-2 text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading disputes…
        </p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {actionError ? <p className="text-sm text-amber-700">{actionError}</p> : null}

      {!loading && !error && disputes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-slate-600">
          No disputes yet.
        </div>
      ) : null}

      {open.length ? (
        <section className="mt-4 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Open <span className="text-sm font-normal text-slate-500">({open.length})</span>
          </h2>
          {open.map((dispute) => (
            <DisputeCard
              key={dispute.id}
              dispute={dispute}
              busyId={busyId}
              onResolve={onResolve}
            />
          ))}
        </section>
      ) : null}

      {closed.length ? (
        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            History <span className="text-sm font-normal text-slate-500">({closed.length})</span>
          </h2>
          {closed.map((dispute) => (
            <DisputeCard
              key={dispute.id}
              dispute={dispute}
              busyId={busyId}
              onResolve={onResolve}
            />
          ))}
        </section>
      ) : null}
    </main>
  );
}
