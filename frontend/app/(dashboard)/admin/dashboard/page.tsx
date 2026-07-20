'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

const panels = [
  {
    href: '/admin/users',
    title: 'Users',
    description: 'Activate, verify, or disable parent and teacher accounts.',
  },
  {
    href: '/admin/verifications',
    title: 'Teacher verifications',
    description: 'Review ID and certificate submissions before teachers go live.',
  },
  {
    href: '/admin/disputes',
    title: 'Disputes',
    description: 'Resolve booking disputes, refunds, and escalations.',
  },
  {
    href: '/admin/bookings',
    title: 'Bookings',
    description: 'Monitor session volume and platform booking health.',
  },
  {
    href: '/admin/analytics',
    title: 'Analytics',
    description: 'High-level metrics for growth and operations.',
  },
  {
    href: '/admin/settings',
    title: 'Settings',
    description: 'Platform configuration reserved for your team.',
  },
];

export default function AdminControlPage() {
  const { data } = useSession();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Team only</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Admin Control</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Private operations console for Tutor Be Betea. Only accounts with the{' '}
          <span className="font-medium text-slate-800">ADMIN</span> role can open these pages.
        </p>
        {data?.user?.email && (
          <p className="mt-3 text-sm text-slate-500">
            Signed in as <span className="font-medium text-slate-700">{data.user.email}</span>
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {panels.map((panel) => (
          <Link
            key={panel.href}
            href={panel.href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">{panel.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{panel.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
