'use client';

import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAdminUsers, type AdminUser } from '@/lib/hooks/use-admin';

function formatDate(value?: string | null) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

function Badge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'good' | 'bad' | 'warn';
}) {
  const styles =
    tone === 'good'
      ? 'bg-tutor-green-50 text-tutor-green-800'
      : tone === 'bad'
        ? 'bg-red-50 text-red-700'
        : tone === 'warn'
          ? 'bg-amber-50 text-amber-800'
          : 'bg-slate-100 text-slate-700';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}

function UserCard({
  user,
  busyId,
  onToggleActive,
  onToggleVerified,
  onApproveTeacher,
}: {
  user: AdminUser;
  busyId: string | null;
  onToggleActive: (user: AdminUser) => void;
  onToggleVerified: (user: AdminUser) => void;
  onApproveTeacher: (user: AdminUser) => void;
}) {
  const busy = busyId === user.id;
  const teacherStatus = user.teacherProfile?.verificationStatus;

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{user.fullName}</h2>
          <p className="text-sm text-slate-600">{user.email}</p>
          <p className="text-sm text-slate-500">{user.phone}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge label={user.userType} />
          <Badge
            label={user.isActive ? 'Active' : 'Disabled'}
            tone={user.isActive ? 'good' : 'bad'}
          />
          <Badge
            label={user.isVerified ? 'Email verified' : 'Email unverified'}
            tone={user.isVerified ? 'good' : 'warn'}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <p>
          <span className="font-medium text-slate-800">Joined:</span> {formatDate(user.createdAt)}
        </p>
        <p>
          <span className="font-medium text-slate-800">Last login:</span>{' '}
          {formatDate(user.lastLoginAt)}
        </p>
        {user.teacherProfile ? (
          <>
            <p>
              <span className="font-medium text-slate-800">Teacher status:</span> {teacherStatus}
            </p>
            <p>
              <span className="font-medium text-slate-800">Rate:</span> $
              {Number(user.teacherProfile.hourlyRate || 0).toFixed(2)}/hr · rating{' '}
              {Number(user.teacherProfile.avgRating || 0).toFixed(1)}
            </p>
          </>
        ) : null}
      </div>

      {user.userType !== 'ADMIN' ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onToggleActive(user)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            {busy ? 'Working…' : user.isActive ? 'Disable' : 'Enable'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onToggleVerified(user)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            {user.isVerified ? 'Unverify email' : 'Verify email'}
          </button>
          {user.userType === 'TEACHER' && teacherStatus !== 'APPROVED' ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => onApproveTeacher(user)}
              className="rounded-lg bg-tutor-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-tutor-green-700 disabled:opacity-60"
            >
              Approve teacher
            </button>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-xs text-slate-500">Admin accounts are managed via seed/allowlist.</p>
      )}
    </article>
  );
}

export default function AdminUsersPage() {
  const { users, loading, error, refresh, manageUser } = useAdminUsers();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return users;
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(needle) ||
        u.email.toLowerCase().includes(needle) ||
        u.phone.toLowerCase().includes(needle) ||
        u.userType.toLowerCase().includes(needle),
    );
  }, [users, query]);

  const teachers = filtered.filter((u) => u.userType === 'TEACHER');
  const parents = filtered.filter((u) => u.userType === 'PARENT');
  const admins = filtered.filter((u) => u.userType === 'ADMIN');

  async function run(user: AdminUser, action: () => Promise<unknown>) {
    setActionError('');
    setBusyId(user.id);
    try {
      await action();
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Users</h1>
          <p className="mt-2 text-slate-600">Manage parents and teachers</p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, phone…"
          className="w-full max-w-xs rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tutor-green-500"
        />
      </div>

      {loading ? (
        <p className="inline-flex items-center gap-2 text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading users…
        </p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {actionError ? <p className="text-sm text-amber-700">{actionError}</p> : null}

      {!loading && !error && filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-slate-600">
          No users matched.
        </div>
      ) : null}

      {[
        { title: 'Teachers', rows: teachers },
        { title: 'Parents', rows: parents },
        { title: 'Admins', rows: admins },
      ].map((section) =>
        section.rows.length ? (
          <section key={section.title} className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              {section.title}{' '}
              <span className="text-sm font-normal text-slate-500">({section.rows.length})</span>
            </h2>
            {section.rows.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                busyId={busyId}
                onToggleActive={(u) =>
                  void run(u, () => manageUser({ userId: u.id, disabled: u.isActive }))
                }
                onToggleVerified={(u) =>
                  void run(u, () =>
                    manageUser({ userId: u.id, emailVerified: !u.isVerified }),
                  )
                }
                onApproveTeacher={(u) =>
                  void run(u, () => manageUser({ userId: u.id, approveVerification: true }))
                }
              />
            ))}
          </section>
        ) : null,
      )}
    </main>
  );
}
