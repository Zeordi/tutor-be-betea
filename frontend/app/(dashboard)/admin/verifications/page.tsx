'use client';

import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  useAdminVerifications,
  type AdminVerification,
} from '@/lib/hooks/use-admin';

function formatDate(value?: string | null) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return value;
  }
}

function asUrls(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value];
  return [];
}

function Badge({ status }: { status: string }) {
  const tone =
    status === 'APPROVED'
      ? 'bg-tutor-green-50 text-tutor-green-800'
      : status === 'REJECTED' || status === 'FLAGGED'
        ? 'bg-red-50 text-red-700'
        : 'bg-amber-50 text-amber-800';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function VerificationCard({
  item,
  busyId,
  onApprove,
}: {
  item: AdminVerification;
  busyId: string | null;
  onApprove: (item: AdminVerification) => void;
}) {
  const teacherUserId = item.teacher?.user?.id;
  const docs = asUrls(item.documentUrls);
  const canApprove = item.status === 'PENDING' && Boolean(teacherUserId);
  const busy = busyId === item.id;

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {item.teacher?.user?.fullName || 'Teacher'}
          </h2>
          <p className="text-sm text-slate-600">{item.teacher?.user?.email}</p>
          <p className="text-sm text-slate-500">{item.teacher?.user?.phone}</p>
        </div>
        <Badge status={item.status} />
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <p>
          <span className="font-medium text-slate-800">Type:</span> {item.verificationType}
        </p>
        <p>
          <span className="font-medium text-slate-800">Submitted:</span>{' '}
          {formatDate(item.createdAt)}
        </p>
        <p>
          <span className="font-medium text-slate-800">Profile status:</span>{' '}
          {item.teacher?.verificationStatus || '—'}
        </p>
        {item.reviewNotes ? (
          <p className="sm:col-span-2">
            <span className="font-medium text-slate-800">Notes:</span> {item.reviewNotes}
          </p>
        ) : null}
      </div>

      {docs.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {docs.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-tutor-green-700 hover:bg-gray-50"
            >
              Open document
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-500">No document URLs attached.</p>
      )}

      {canApprove ? (
        <div className="mt-4">
          <button
            type="button"
            disabled={busy}
            onClick={() => onApprove(item)}
            className="rounded-lg bg-tutor-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-tutor-green-700 disabled:opacity-60"
          >
            {busy ? 'Approving…' : 'Approve teacher'}
          </button>
        </div>
      ) : null}
    </article>
  );
}

export default function AdminVerificationsPage() {
  const { verifications, loading, error, refresh, approveTeacher } = useAdminVerifications();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const pending = useMemo(
    () => verifications.filter((v) => v.status === 'PENDING'),
    [verifications],
  );
  const reviewed = useMemo(
    () => verifications.filter((v) => v.status !== 'PENDING'),
    [verifications],
  );

  async function onApprove(item: AdminVerification) {
    const userId = item.teacher?.user?.id;
    if (!userId) return;
    setActionError('');
    setBusyId(item.id);
    try {
      await approveTeacher(userId);
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Approve failed');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Teacher verifications
        </h1>
        <p className="mt-2 text-slate-600">
          Review ID and certificate submissions before teachers go live. Approve uses the existing
          admin user management API.
        </p>
      </div>

      {loading ? (
        <p className="inline-flex items-center gap-2 text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading verifications…
        </p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {actionError ? <p className="text-sm text-amber-700">{actionError}</p> : null}

      {!loading && !error && verifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-slate-600">
          No verification submissions yet.
        </div>
      ) : null}

      {pending.length ? (
        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Pending <span className="text-sm font-normal text-slate-500">({pending.length})</span>
          </h2>
          {pending.map((item) => (
            <VerificationCard
              key={item.id}
              item={item}
              busyId={busyId}
              onApprove={onApprove}
            />
          ))}
        </section>
      ) : null}

      {reviewed.length ? (
        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            History <span className="text-sm font-normal text-slate-500">({reviewed.length})</span>
          </h2>
          {reviewed.map((item) => (
            <VerificationCard
              key={item.id}
              item={item}
              busyId={busyId}
              onApprove={onApprove}
            />
          ))}
        </section>
      ) : null}
    </main>
  );
}
