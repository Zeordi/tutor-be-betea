'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export function MobileNav() {
  const { data } = useSession();
  const role = data?.user?.role;

  if (role === 'ADMIN') {
    return (
      <nav className="flex gap-4 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 text-sm md:hidden">
        <Link href="/admin/dashboard">Control</Link>
        <Link href="/admin/users">Users</Link>
        <Link href="/admin/verifications">Verify</Link>
        <Link href="/admin/disputes">Disputes</Link>
      </nav>
    );
  }

  if (role === 'TEACHER') {
    return (
      <nav className="flex gap-4 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 text-sm md:hidden">
        <Link href="/teacher/dashboard">Home</Link>
        <Link href="/teacher/bookings">Bookings</Link>
        <Link href="/teacher/profile">Profile</Link>
      </nav>
    );
  }

  return (
    <nav className="flex gap-4 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 text-sm md:hidden">
      <Link href="/parent/dashboard">Home</Link>
      <Link href="/parent/search">Search</Link>
      <Link href="/parent/bookings">Bookings</Link>
      <Link href="/parent/profile">Profile</Link>
    </nav>
  );
}
