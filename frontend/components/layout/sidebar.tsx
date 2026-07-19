import Link from 'next/link';

const links = [
  { href: '/parent/dashboard', label: 'Dashboard' },
  { href: '/parent/search', label: 'Search' },
  { href: '/parent/bookings', label: 'Bookings' },
  { href: '/parent/favorites', label: 'Favorites' },
  { href: '/parent/profile', label: 'Profile' },
];

export function Sidebar() {
  return (
    <aside className="hidden border-r border-slate-200 bg-white/70 p-4 md:block">
      <p className="mb-6 font-display text-2xl text-brand-900">BeTea</p>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-900"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
