'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const { data } = useSession();
  const role = data?.user?.role;
  const isAdmin = role === 'ADMIN';

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur">
      <Link href={isAdmin ? '/admin/dashboard' : '/'} className="font-display text-xl text-brand-900">
        Tutor Be Betea
      </Link>
      <nav className="flex items-center gap-3 text-sm">
        {isAdmin ? (
          <Link href="/admin/dashboard" className="font-medium text-brand-700 hover:text-brand-900">
            Admin Control
          </Link>
        ) : (
          <>
            <Link href="/parent/search" className="text-slate-600 hover:text-brand-700">
              Search
            </Link>
            <Link href="/parent/messages" className="text-slate-600 hover:text-brand-700">
              Messages
            </Link>
          </>
        )}
        {data?.user ? (
          <>
            <span className="hidden text-slate-500 sm:inline">{data.user.email}</span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100"
            >
              Sign out
            </button>
          </>
        ) : (
          <Link href="/login" className="text-slate-600 hover:text-brand-700">
            Log in
          </Link>
        )}
      </nav>
    </header>
  );
}
