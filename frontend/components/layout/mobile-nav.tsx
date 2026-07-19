import Link from 'next/link';

export function MobileNav() {
  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 text-sm md:hidden">
      <Link href="/parent/dashboard">Home</Link>
      <Link href="/parent/search">Search</Link>
      <Link href="/parent/bookings">Bookings</Link>
      <Link href="/parent/messages">Chat</Link>
    </nav>
  );
}
