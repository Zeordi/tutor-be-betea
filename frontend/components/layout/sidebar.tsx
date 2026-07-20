'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const parentLinks = [
  { href: '/parent/dashboard', label: 'Dashboard' },
  { href: '/parent/search', label: 'Search' },
  { href: '/parent/bookings', label: 'Bookings' },
  { href: '/parent/favorites', label: 'Favorites' },
  { href: '/parent/messages', label: 'Messages' },
  { href: '/parent/profile', label: 'Profile' },
];

const teacherLinks = [
  { href: '/teacher/dashboard', label: 'Dashboard' },
  { href: '/teacher/bookings', label: 'Bookings' },
  { href: '/teacher/availability', label: 'Availability' },
  { href: '/teacher/earnings', label: 'Earnings' },
  { href: '/teacher/messages', label: 'Messages' },
  { href: '/teacher/profile', label: 'Profile' },
  { href: '/teacher/verification', label: 'Verification' },
];

const adminLinks = [
  { href: '/admin/dashboard', label: 'Control Center' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/verifications', label: 'Verifications' },
  { href: '/admin/disputes', label: 'Disputes' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/settings', label: 'Settings' },
];

function linksForRole(role?: string) {
  if (role === 'ADMIN') return adminLinks;
  if (role === 'TEACHER') return teacherLinks;
  return parentLinks;
}

export function Sidebar() {
  const { data } = useSession();
  const role = data?.user?.role;
  const pathname = usePathname();
  const links = linksForRole(role);

  return (
    <aside className="hidden border-r border-slate-200 bg-white/70 p-4 md:block">
      <p className="mb-1 font-display text-2xl text-brand-900">በቤቴ</p>
      <p className="mb-6 text-xs uppercase tracking-wide text-slate-500">
        {role === 'ADMIN' ? 'Admin console' : role === 'TEACHER' ? 'Teacher' : 'Parent'}
      </p>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm ${
                active
                  ? 'bg-brand-50 font-medium text-brand-900'
                  : 'text-slate-700 hover:bg-brand-50 hover:text-brand-900'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
